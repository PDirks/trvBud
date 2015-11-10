# trvBud

to import db into mongo...

$ iconv -f ISO-8859-15 -t UTF-8 wc.txt > wc.txt

$ mongoimport --db world --collection city --file ./wc.txt --type csv --headerline
