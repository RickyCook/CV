curl_opts = --progress-bar

pdf: check_wkhtmltopdf dirs html
	wkhtmltopdf -s A4 dist/cv.html dist/cv.pdf
html: check_rst2html build/style.css
	cat README.rst | ./bash_tpl_process.sh | rst2html.py --stylesheet build/style.css > dist/cv.html

publish: on-gh-pages html
	cat dist/cv.html > index.html
	git commit -m 'Publish from make' index.html
	git push
	git checkout master

# FONTS
build/lato.ttf: dirs
	@echo "Downloading Lato font (TTF)"
	@curl $(curl_opts) -o build/lato.ttf http://themes.googleusercontent.com/static/fonts/lato/v7/v0SdcGFAl2aezM9Vq_aFTQ.ttf
build/typicons.ttf: dirs
	@echo "Downloading Typicons font (TTF)"
	@curl $(curl_opts) -o build/typicons.ttf https://github.com/stephenhutchings/typicons.font/blob/master/src/font/typicons.ttf?raw=true

# FONT CSS
build/font-lato.css: build/lato.ttf
	@echo "Downloading Lato font (CSS)"
	@curl $(curl_opts) -o build/font-lato.css http://fonts.googleapis.com/css?family=Lato
	@sed -i 's|http://themes\.googleusercontent\.com/static/fonts/lato/v7/v0SdcGFAl2aezM9Vq_aFTQ\.ttf|lato\.ttf|' build/font-lato.css
build/font-typicons.css: build/typicons.ttf
	@echo "Downloading Typicons font (CSS)"
	@curl $(curl_opts) -o build/font-typicons.css https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/font/typicons.min.css

# MAIN STYLE
build/style.css: build/font-lato.css build/font-typicons.css
	node_modules/.bin/grunt

check_rst2html:
	@which rst2html.py || exit 1
check_wkhtmltopdf:
	# Requires wkhtmltopdf static, or an X server
	@which wkhtmltopdf || exit 1

on-gh-pages:
	git checkout gh-pages
	git pull
	git merge master

dirs:
	@mkdir -p build dist

clean:
	@rm -rf build dist

.PHONY: check_rst2html clean
