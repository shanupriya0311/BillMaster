import os
import re

def remove_comments_from_file(filepath):
    """Remove all types of comments from JS/JSX/CSS/SCSS files"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        lines = content.split('\n')
        cleaned_lines = []
        in_multiline_comment = False
        
        for line in lines:
            # Check for multiline comment start
            if '/*' in line and '*/' not in line:
                # Remove everything after /*
                before_comment = line.split('/*')[0]
                if before_comment.strip():
                    cleaned_lines.append(before_comment.rstrip())
                in_multiline_comment = True
                continue
            
            # Check for multiline comment end
            if in_multiline_comment:
                if '*/' in line:
                    # Remove everything before */
                    after_comment = line.split('*/', 1)[1] if '*/' in line else ''
                    if after_comment.strip():
                        cleaned_lines.append(after_comment.lstrip())
                    in_multiline_comment = False
                continue
            
            # Handle single-line multiline comments /* ... */
            if '/*' in line and '*/' in line:
                # Remove all /* ... */ patterns
                cleaned_line = re.sub(r'/\*.*?\*/', '', line)
                if cleaned_line.strip():
                    cleaned_lines.append(cleaned_line.rstrip())
                continue
            
            # Handle // comments
            if '//' in line:
                # Check if it's in a string (basic check)
                before_comment = line.split('//')[0]
                if before_comment.strip():
                    cleaned_lines.append(before_comment.rstrip())
                continue
            
            # Keep lines that don't have comments
            cleaned_lines.append(line.rstrip())
        
        # Join lines and remove excessive blank lines
        new_content = '\n'.join(cleaned_lines)
        
        # Remove multiple consecutive blank lines (more than 2)
        new_content = re.sub(r'\n\n\n+', '\n\n', new_content)
        
        # Only write if content changed
        if new_content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def process_directory(root_dir):
    """Process all JS/JSX/CSS/SCSS files in directory"""
    extensions = ('.js', '.jsx', '.css', '.scss')
    modified_files = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules
        if 'node_modules' in root:
            continue
            
        for file in files:
            if file.endswith(extensions):
                filepath = os.path.join(root, file)
                if remove_comments_from_file(filepath):
                    modified_files.append(filepath)
                    print(f"✓ Cleaned: {filepath}")
    
    return modified_files

if __name__ == "__main__":
    src_dir = r"c:\Users\shanu\Downloads\BillMaster-main\BillMaster-main\src"
    print(f"Removing comments from: {src_dir}")
    print("=" * 60)
    
    modified = process_directory(src_dir)
    
    print("=" * 60)
    print(f"\n✅ Complete! Modified {len(modified)} files")
