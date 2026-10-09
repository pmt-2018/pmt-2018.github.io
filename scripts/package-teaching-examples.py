"""Rebuild the checked-in teaching ZIPs after editing their source folders."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


root = Path(__file__).resolve().parents[1]
folders = [
    root / "public/files/cpp-starter/windows-winlibs",
    root / "public/files/cpp-starter/windows-msys2",
    root / "public/files/latex-workshop",
]

for folder in folders:
    archive = folder.with_suffix(".zip")
    with ZipFile(archive, "w", compression=ZIP_DEFLATED) as output:
        for path in sorted(folder.rglob("*")):
            if not path.is_file():
                continue
            # Fixed timestamps keep repeated packaging reproducible.
            info = ZipInfo(str(path.relative_to(folder.parent)), (2026, 10, 9, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            output.writestr(info, path.read_bytes())
    print(archive.relative_to(root))
