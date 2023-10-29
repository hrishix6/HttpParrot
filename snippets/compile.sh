#!/bin/bash

# Define an array of strings
templates=("curl" "js")

# Loop over the array elements
for element in "${templates[@]}"; do
    # Replace the 'echo' command with your desired command
    echo "Generating precompiled template for : $element"

    # Add your command here that uses the loop variable and redirect stderr to log file
    # For example:
    npx handlebars ./snippets/$element.handlebars -f public/js/hbs_precompiled/$element.precompiled.js

    # Check the exit status of the command
    if [ $? -eq 0 ]; then
        echo "Generated for $element"
    else
        echo "Error occurred while generating $element."
    fi
done