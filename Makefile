html: check_pandoc dirs build/font-lato.css
	cat README.rst | ./bash_tpl_process.sh | pandoc -f rst -t html --self-contained --css style.css -o dist/cv.html

build/font-lato.css: dirs
	curl -o build/font-lato.css http://fonts.googleapis.com/css?family=Lato

check_pandoc:
	@which pandoc || exit 1

dirs:
	@mkdir -p build dist

clean:
	@rm -rf build dist

.PHONY: check_pandoc clean
