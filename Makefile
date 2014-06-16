html: check_rst2html build/style.css
	cat README.rst | ./bash_tpl_process.sh | rst2html.py --stylesheet build/style.css > dist/cv.html

build/font-lato.css: dirs
	curl -o build/font-lato.css http://fonts.googleapis.com/css?family=Lato
build/font-fontawesome.css: dirs
	curl -o build/font-fontawesome.css http://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css
build/style.css: build/font-lato.css build/font-fontawesome.css
	node_modules/.bin/grunt

check_rst2html:
	@which rst2html.py || exit 1

dirs:
	@mkdir -p build dist

clean:
	@rm -rf build dist

.PHONY: check_pandoc clean
