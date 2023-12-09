#!/bin/bash

input_folder="/Users/joba/Downloads/ai"
two_days_ago=$(date -v-14d +%s)


# Loop through all JPEG and JPG files in the current directory
for file in "$input_folder"/*.jpeg "$input_folder"/*.jpg "$input_folder"/*.png; do

    creation_timestamp=$(stat -f "%B" "$file")
    if [[ $creation_timestamp -ge $two_days_ago || $file == "$input_folder/"Default_* || $file == "$input_folder/"Leonardo_* || $file == "$input_folder/"ideogram* ]]; then
    
        # Use identify to get the dimensions of the image
        dimensions=$(identify -format "%wx%h" "$file")

        # Extract width and height from the dimensions
        width=$(echo "$dimensions" | cut -d'x' -f1)
        height=$(echo "$dimensions" | cut -d'x' -f2)

        # Check if the dimensions are equal
        if [[ "$width" -eq "$height" ]]; then
            # Move the image to the SQUARE folder
            mv "$file" /Users/joba/Projects/OnTheWall/code/UNPROCESSED/square/
            echo "Moved $file to SQUARE/"
        fi

        # Check if the dimensions are equal
        if [[ "$width" -gt "$height" ]]; then
            # Move the image to the 16-10 folder
            mv "$file" /Users/joba/Projects/OnTheWall/code/UNPROCESSED/16-10/
            echo "Moved $file to 16-10/"
        fi

        # Check if the dimensions are equal
        if [[ "$height" -gt "$width" ]]; then
            # Move the image to the 16-10 folder
            mv "$file" /Users/joba/Projects/OnTheWall/code/UNPROCESSED/10-16/
            echo "Moved $file to 10-16/"
        fi
      
    fi
    

done