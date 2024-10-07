import os

def display_directory_structure(startpath, exclude_dirs=None):
    if exclude_dirs is None:
        exclude_dirs = ['.git', '__pycache__', 'venv', 'env']
    
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{sub_indent}{f}")

if __name__ == "__main__":
    project_path = "."  # Ruta al directorio del proyecto, "." para el directorio actual
    print("Estructura del proyecto:")
    display_directory_structure(project_path)