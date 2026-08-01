from PIL import Image

SRC = r'C:\Users\Windows\.cursor\projects\c-Grupo-O-Especialista-CONTENTFY-Aplicativos-jurismind\assets\c__Users_Windows_AppData_Roaming_Cursor_User_workspaceStorage_fbca823cc5d5df66561c3c5f1fe9f60e_images_Favicon-7bede936-ca15-4ddf-bca7-e34caa7f44f7.png'
OUT = r'c:\Grupo O Especialista\CONTENTFY\Aplicativos\jurismind\public\favicon.png'

img = Image.open(SRC).convert('RGBA')
w, h = img.size
px = img.load()


def is_gold(r: int, g: int, b: int, a: int) -> bool:
    if a < 128:
        return False
    return r > 90 and g > 70 and b < 130 and (r + g) > b * 2.2


LEFT = range(15, 110)
RIGHT = range(w - 110, w - 15)

top = next(y for y in range(h) if any(is_gold(*px[x, y]) for x in LEFT) or any(is_gold(*px[x, y]) for x in RIGHT))
left = next(x for x in range(w) if any(is_gold(*px[x, y]) for y in range(15, 160)))
right = next(x for x in range(w - 1, -1, -1) if any(is_gold(*px[x, y]) for y in range(15, 160)))

side = right - left + 1
crop_l = left
crop_t = top
crop_r = left + side
crop_b = top + side

cropped = img.crop((crop_l, crop_t, crop_r, crop_b))
final = cropped.resize((512, 512), Image.Resampling.LANCZOS)
final.save(OUT, format='PNG', optimize=True)
print(f'crop=({crop_l},{crop_t},{crop_r},{crop_b}) size={cropped.size}')
