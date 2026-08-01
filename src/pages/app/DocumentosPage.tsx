import { useEffect, useState, useRef } from 'react'
import { Upload, Trash2, Download, File } from 'lucide-react'
import { env } from '../../config/env'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { listDocuments, uploadDocument, deleteDocument, getDocumentDownloadUrl } from '../../services/taskService'
import type { Document } from '../../types/entities'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { formatDateBR } from '../../lib/helpers'

const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export function DocumentosPage() {
  const { session, canWrite } = useAuth()
  const { success, error: toastError } = useToast()
  const orgId = session!.organization.id
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    setDocs(await listDocuments(orgId))
    setLoading(false)
  }

  useEffect(() => { load() }, [orgId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canWrite) return
    if (file.size > MAX_SIZE) { toastError('Arquivo muito grande. Máximo 10 MB.'); return }
    if (!ALLOWED.includes(file.type)) { toastError('Formato não permitido.'); return }

    try {
      if (env.demoMode) {
        await uploadDocument(orgId, {
          fileName: file.name,
          filePath: `demo/${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: session!.userId,
          uploadedByName: session!.profile.fullName,
        })
      } else {
        await uploadDocument(orgId, file, {
          userId: session!.userId,
          userName: session!.profile.fullName,
        })
      }
      success('Documento enviado com sucesso.')
      load()
    } catch {
      toastError('Não foi possível enviar o documento.')
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const formatSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

  if (loading) return <LoadingState />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-muted">{docs.length} documento(s)</p>
        {canWrite && (
          <>
            <input ref={inputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleUpload} />
            <Button variant="gold" size="sm" onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4" />Upload</Button>
          </>
        )}
      </div>
      <p className="text-xs text-text-muted">Supabase Storage será utilizado em produção. Formatos: PDF, DOC, DOCX, JPG, PNG. Máx. 10 MB.</p>

      {docs.length === 0 ? (
        <EmptyState icon={File} title="Nenhum documento" description="Faça upload de documentos vinculados a clientes ou processos." actionLabel="Upload" onAction={() => inputRef.current?.click()} />
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <Card key={d.id} padding="sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <File className="h-8 w-8 text-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-navy dark:text-ice truncate">{d.fileName}</p>
                    <p className="text-xs text-text-muted">{formatSize(d.fileSize)} · {formatDateBR(d.createdAt.split('T')[0])} · {d.uploadedByName}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={async () => {
                    if (env.demoMode) return
                    try {
                      const url = await getDocumentDownloadUrl(d.filePath)
                      window.open(url, '_blank')
                    } catch {
                      toastError('Não foi possível baixar o documento.')
                    }
                  }}><Download className="h-4 w-4" /></Button>
                  {canWrite && <Button variant="ghost" size="sm" onClick={() => setDeleteId(d.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => {
        if (deleteId) {
          await deleteDocument(deleteId, orgId, session!.userId, session!.profile.fullName)
          setDeleteId(null)
          load()
        }
      }} title="Excluir documento" message="Confirma a exclusão?" variant="danger" confirmLabel="Excluir" />
    </div>
  )
}
