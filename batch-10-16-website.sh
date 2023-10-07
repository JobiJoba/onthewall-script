#!/bin/bash

input_folder="/Users/joba/Projects/OnTheWall/code/2-Process/10-16"
output_folder="/Users/joba/Projects/OnTheWall/code/To-Sell/10-16-website"
max_count=$(ls "$output_folder" | grep -oE '[0-9]+' | sort -rn | head -n 1)
start_number=$((max_count + 1))

echo "$start_number"

for file in "$input_folder"/*.png; do
    output_file="$output_folder/W-OTW-$start_number.jpg"
    
    convert "$file" -resize 1240x1754! -density 72 -units pixelsperinch -quality 80 -filter Lanczos "$output_file"
    start_number=$((start_number + 1))

done

echo "Converted $start_number"


