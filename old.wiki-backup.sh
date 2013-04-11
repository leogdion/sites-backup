#!/bin/bash
NOW=$(date +"%Y-%m-%d-%H%M")
SITE_DIRECTORY=$1
MYSQL_PASSWORD=$2
MYSQL_PASSWORD_ARG=-$2

if [ -z "$1" ]; then
   SITE_DIRECTORY=`pwd`
fi

SITE_NAME=`basename $SITE_DIRECTORY`
WIKI_CONFIG_FILE=$SITE_DIRECTORY/LocalSettings.php
DB_NAME=`grep -Po "(?<=wgDBname           = \").+(?=\";)" $WIKI_CONFIG_FILE`
TEMP_DIRECTORY=/tmp/$SITE_NAME-$NOW
DUMP_PATH=$TEMP_DIRECTORY/database.sql
FILENAME=$SITE_NAME-$NOW.tar.gz

mkdir $TEMP_DIRECTORY
mysqldump --add-drop-table -u root -p$MYSQL_PASSWORD $DB_NAME >$DUMP_PATH
cp -r -u -x $SITE_DIRECTORY $TEMP_DIRECTORY/www
tar -zcf $FILENAME -C $TEMP_DIRECTORY .
rm -rf $TEMP_DIRECTORY
echo $FILENAME
