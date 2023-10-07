#!/bin/bash

input_folder="/Users/joba/Projects/OnTheWall/code/2-Process/10-16"
output_folder="/Users/joba/Projects/OnTheWall/code/To-Sell/10-16"
max_count=$(ls "$output_folder" | grep -oE '[0-9]+' | sort -rn | head -n 1)
start_number=$((max_count + 1))

echo "Convert $start_number"

for file in "$input_folder"/*.png; do
    output_file="$output_folder/OTW-$start_number.jpg"
    
    convert "$file" -resize 4961x7016! -density 300 -units pixelsperinch -quality 100 -filter Lanczos "$output_file"
    start_number=$((start_number + 1))

done



