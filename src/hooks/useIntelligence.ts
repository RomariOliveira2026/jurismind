import { useQuery } from '@tanstack/react-query'
import { computeIntelligence, fetchTimeline } from '../services/intelligenceService'

export function useIntelligence(orgId: string) {
  return useQuery({
    queryKey: ['intelligence', orgId],
    enabled: !!orgId,
    staleTime: 1000 * 60 * 2,
    queryFn: () => computeIntelligence(orgId),
  })
}

export function useTimeline(orgId: string, caseId?: string) {
  return useQuery({
    queryKey: ['timeline', orgId, caseId],
    enabled: !!orgId,
    staleTime: 1000 * 60 * 2,
    queryFn: () => fetchTimeline(orgId, caseId),
  })
}
