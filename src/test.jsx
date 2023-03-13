#!bin/sh
for file in $(grep -l -Rnw './' -e "import React"); do 
mv "$file" "${file%.*}.jsx"; done;