#!/bin/bash

input_folder="/Users/joba/Projects/OnTheWall/code/1-Process/square"
output_folder="/Users/joba/Projects/OnTheWall/code/To-Sell/square"
max_count=$(ls "$output_folder" | grep -oE '[0-9]+' | sort -rn | head -n 1)
start_number=$((max_count + 1))

echo "Convert $start_number"


for file in "$input_folder"/*.png; do
    output_file="$output_folder/OTWS-$start_number.jpg"
    
    convert "$file" -resize 4096x4096! -density 300 -units pixelsperinch -quality 100 -filter Lanczos "$output_file"
    start_number=$((start_number + 1))

done

echo "END OF CONVERT BATCH-SQUARE.sh $start_number"



