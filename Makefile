html: check_rst2html build/style.css
	cat README.rst | ./bash_tpl_process.sh | rst2html.py --stylesheet build/style.css > dist/cv.html

# FONTS
build/lato.ttf: dirs
	curl -o build/lato.ttf http://themes.googleusercontent.com/static/fonts/lato/v7/v0SdcGFAl2aezM9Vq_aFTQ.ttf
build/typicons.ttf: dirs
	curl -o build/typicons.ttf https://github.com/stephenhutchings/typicons.font/blob/master/src/font/typicons.ttf?raw=true

# FONT CSS
build/font-lato.css: build/lato.ttf
	curl -o build/font-lato.css http://fonts.googleapis.com/css?family=Lato
	sed -i .bak 's|http://themes\.googleusercontent\.com/static/fonts/lato/v7/v0SdcGFAl2aezM9Vq_aFTQ\.ttf|lato\.ttf|' build/font-lato.css
build/font-typicons.css: build/typicons.ttf
	curl -o build/font-typicons.css https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/font/typicons.min.css

# MAIN STYLE
build/style.css: build/font-lato.css build/font-typicons.css
	node_modules/.bin/grunt

check_rst2html:
	@which rst2html.py || exit 1

dirs:
	@mkdir -p build dist

clean:
	@rm -rf build dist

.PHONY: check_pandoc clean
