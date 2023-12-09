#!/bin/bash

input_folder="/Users/joba/Projects/OnTheWall/code/2-Process/16-10"
output_folder="/Users/joba/Projects/OnTheWall/code/To-Sell/16-10-website"
max_count=$(ls "$output_folder" | grep -oE '[0-9]+' | sort -rn | head -n 1)
start_number=$((max_count + 1))

echo "$start_number"

for file in "$input_folder"/*.png; do
    output_file="$output_folder/W-OTW-$start_number.jpg"
    
    convert "$file" -resize 1754x1240! -density 72 -units pixelsperinch -quality 80 -filter Lanczos "$output_file"
    start_number=$((start_number + 1))

done

echo "Converted $start_number"


