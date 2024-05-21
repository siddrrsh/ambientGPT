import subprocess
import shlex
import os

def generate_description(model, prompt, image_path, max_tokens=100, temperature=0.0):
    # Check if the image path is a URL or a local file
    if os.path.isfile(image_path):
        # It's a file, use the local path
        image_arg = f'"{image_path}"'
    else:
        # It's a URL, use it directly
        image_arg = f'"{image_path}"'

    # Construct the command as a string
    command = f"""
    python3 -m mlx_vlm.generate --model {model} \
    --prompt "{prompt}" --image {image_arg} \
    --max-tokens {max_tokens} --temp {temperature}
    """
    
    # Use shlex to split the command into a list of arguments
    args = shlex.split(command)
    
    # Run the command
    result = subprocess.run(args, capture_output=True, text=True)
    
    # Check if the command was successful
    if result.returncode == 0:
        print("Output:", result.stdout)
    else:
        print("Error:", result.stderr)

    return result.stdout

if __name__ == "__main__":
    model = "mlx-community/llava-phi-3-mini-4bit"
    prompt = "Describe what is in this image?"
    image_path = "todos.png"  # This can be a local path or a URL
    max_tokens = 100
    temperature = 0.0

    # Call the function with the parameters
    generate_description(model, prompt, image_path, max_tokens, temperature)