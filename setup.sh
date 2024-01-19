#! /usr/bin/env bash
# cd C:/goa-kiosk

scriptType=$1

if [[ $scriptType ==  "" ]]; then
    echo -e "Which script do you want to run?"
    select type in "Sensors" "Vernier" "Reveal" "Height" "Weight" "Exit"; do
        case $type in
            Sensors) scriptType=$type; break;;
            Vernier) scriptType=$type; break;;
            Reveal) scriptType=$type; break;;
            Weight) scriptType=$type; break;;
            Height) scriptType=$type; break;;
            Exit) exit;;
        esac
    done
fi

echo "Starting Server for" $scriptType

# npm install
mkdir sensor-files && mkdir vernier-files && mkdir reveal-files && mkdir height-files && mkdir weight-files
# cd client && npm install && npm run build && cd ..

npm run $scriptType