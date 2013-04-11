#!/bin/bash
for domain in $( ls path );
do
   if [ -f path/$domain/wp-config.php ]; then
      echo "backing up $domain..."
      filename=$(./wp-backup.sh $domain "PASSWORD")
   elif [ -f path/$domain/LocalSettings.php ]; then
      echo "backing up $domain..."
      filename=$(./wiki-backup.sh /usr/share/nginx/$domain "PASSWORD")
   fi
   if [ -n "$filename" ]; then
      s3put -a accesscode -s secretkey -b bucketname $filename
      rm -f $filename
   fi
done
