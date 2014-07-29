affinity.min.js: www/js/*.js
	cat www/js/affinity.js www/js/affinity-utils.js www/js/help.js www/js/inr.js www/js/quickdiary.js www/js/home.js www/js/library.js www/js/riskcalcs.js www/js/diary-cal.js www/js/locker.js www/js/settings.js www/js/diary.js www/js/inr-time.js www/js/profile.js www/js/storage.js > /tmp/build1.js
	node_modules/ngmin/bin/ngmin /tmp/build1.js /tmp/build1.annotated.js
	java -jar misc/compiler.jar /tmp/build1.annotated.js > www/affinity.min.js

