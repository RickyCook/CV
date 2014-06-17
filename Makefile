curl_opts = --progress-bar

pdf: check_wkhtmltopdf dirs html
	wkhtmltopdf -s A4 dist/cv.html dist/cv.pdf
html: check_rst2html build/style.css rst_private rst_to_html
html_publish: check_rst2html build/style.css rst_publish rst_to_html

rst_private:
	cat README.rst | ./bash_tpl_process.sh private_env_vars > build/README.rst
rst_publish:
	cat README.rst | ./bash_tpl_process.sh private_env_vars.example > build/README.rst
rst_to_html:
	cat build/README.rst | rst2html.py --stylesheet build/style.css > dist/cv.html

publish: on-gh-pages html_publish
	cat dist/cv.html > index.html
	git commit -m 'Publish from make' index.html
	git push
	git checkout master

# FONTS
build/lato.ttf: dirs
	@echo "Downloading Lato font (TTF)"
	@curl $(curl_opts) -o build/lato.ttf http://themes.googleusercontent.com/static/fonts/lato/v7/v0SdcGFAl2aezM9Vq_aFTQ.ttf
build/questrial.ttf: dirs
	@echo "Downloading Questrial font (TTF)"
	@curl $(curl_opts) -o build/questrial.ttf http://themes.googleusercontent.com/static/fonts/questrial/v4/MYWJ4lYm5dbZ1UBuYox79KCWcynf_cDxXwCLxiixG1c.ttf
build/roboto-regular.ttf: dirs
	@echo "Downloading Roboto Slab Regular font (TTF)"
	@curl $(curl_opts) -o build/roboto-regular.ttf http://themes.googleusercontent.com/static/fonts/robotoslab/v3/y7lebkjgREBJK96VQi37Zp0EAVxt0G0biEntp43Qt6E.ttf
build/roboto-light.ttf: dirs
	@echo "Downloading Roboto Slab Light font (TTF)"
	@curl $(curl_opts) -o build/roboto-light.ttf http://themes.googleusercontent.com/static/fonts/robotoslab/v3/dazS1PrQQuCxC3iOAJFEJbfB31yxOzP-czbf6AAKCVo.ttf
build/roboto-bold.ttf: dirs
	@echo "Downloading Roboto Slab Bold font (TTF)"
	@curl $(curl_opts) -o build/roboto-bold.ttf http://themes.googleusercontent.com/static/fonts/robotoslab/v3/dazS1PrQQuCxC3iOAJFEJZ_TkvowlIOtbR7ePgFOpF4.ttf
build/typicons.ttf: dirs
	@echo "Downloading Typicons font (TTF)"
	@curl $(curl_opts) -o build/typicons.ttf https://github.com/stephenhutchings/typicons.font/blob/master/src/font/typicons.ttf?raw=true

# FONT CSS
build/font-lato.css: build/lato.ttf
	@echo "Downloading Lato font (CSS)"
	@curl $(curl_opts) -o build/font-lato.css http://fonts.googleapis.com/css?family=Lato
	@sed -i 's|http://themes\.googleusercontent\.com/static/fonts/lato/v7/v0SdcGFAl2aezM9Vq_aFTQ\.ttf|lato\.ttf|' build/font-lato.css
build/font-questrial.css: build/questrial.ttf
	@echo "Downloading Questrial font (CSS)"
	@curl $(curl_opts) -o build/font-questrial.css http://fonts.googleapis.com/css?family=Questrial
	@sed -i 's|http://themes\.googleusercontent\.com/static/fonts/questrial/v4/MYWJ4lYm5dbZ1UBuYox79KCWcynf_cDxXwCLxiixG1c\.ttf|questrial\.ttf|' build/font-questrial.css
build/font-roboto.css: build/roboto-regular.ttf build/roboto-light.ttf build/roboto-bold.ttf
	@echo "Downloading Roboto Slab font (CSS)"
	@curl $(curl_opts) -o build/font-roboto.css http://fonts.googleapis.com/css?family=Roboto+Slab:400,300,700
	@sed -i 's|http://themes\.googleusercontent\.com/static/fonts/robotoslab/v3/y7lebkjgREBJK96VQi37Zp0EAVxt0G0biEntp43Qt6E\.ttf|roboto-regular\.ttf|' build/font-roboto.css
	@sed -i 's|http://themes\.googleusercontent\.com/static/fonts/robotoslab/v3/dazS1PrQQuCxC3iOAJFEJbfB31yxOzP-czbf6AAKCVo\.ttf|roboto-light\.ttf|' build/font-roboto.css
	@sed -i 's|http://themes\.googleusercontent\.com/static/fonts/robotoslab/v3/dazS1PrQQuCxC3iOAJFEJZ_TkvowlIOtbR7ePgFOpF4\.ttf|roboto-bold\.ttf|' build/font-roboto.css
build/font-typicons.css: build/typicons.ttf
	@echo "Downloading Typicons font (CSS)"
	@curl $(curl_opts) -o build/font-typicons.css https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/font/typicons.min.css

# MAIN STYLE
build/style.css: build/font-roboto.css build/font-typicons.css
	node_modules/.bin/grunt

check_rst2html:
	@which rst2html.py || exit 1
check_wkhtmltopdf:
	# Requires wkhtmltopdf static, or an X server
	@which wkhtmltopdf || exit 1

on-gh-pages:
	git checkout gh-pages
	git pull
	git merge -m 'Update from master' master

dirs:
	@mkdir -p build dist

clean:
	@rm -rf build dist

.PHONY: check_rst2html clean
