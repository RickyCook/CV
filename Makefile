html: check_pandoc dirs build/font-lato.css
	pandoc -f rst -t html --self-contained --css style.css -o dist/cv.html README.rst

build/font-lato.css: dirs
	curl -o build/font-lato.css http://fonts.googleapis.com/css?family=Lato

check_pandoc:
	@which pandoc || exit 1

dirs:
	@mkdir -p build dist

.PHONY: check_pandoc
