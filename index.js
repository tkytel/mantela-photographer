/*
 * フォーム送信時のイベントハンドラ
 * mantela.json を取得し、接続情報を解析し、表示する。
 */
formMantela.addEventListener('submit', async e => {
	e.preventDefault();
	btnGenerate.disabled = true;
	const start = performance.now();
	outputStatus.textContent = '';
	const mantelas = await (_ => checkNest.checked
		? fetchMantelas(urlMantela.value, +numNest.value)
		: fetchMantelas(urlMantela.value))();
	const stop = performance.now();
	outputStatus.textContent = `Done. (${stop - start} ms)`;
	btnGenerate.disabled = false;

    const media = []
    const seen = new Set()

	mantelas.forEach((v, _) => {
        v.extensions.map((x) => {
            if (!('image' in x)) {
                return
            }

            if (!seen.has(x.image)) {
                desc = x.name + ', ' + x.extension + ' on '
                desc += v.aboutMe.name + ' '
                desc += '(' + v.aboutMe.identifier + ')'
                desc.replace(/\n|\\n/g, ' ')

                seen.add(x.image)
                media.push([
                    x.image,
                    desc,
                ])
            }
        })
	});

    const gallery = document.getElementById("gallery");

    media.map((x) => {
        const wrapper = document.createElement("figure");
        wrapper.style.margin = "1rem 0";

        const obj = document.createElement("object");
        obj.data = x[0];
        obj.loading = "lazy";
        obj.type = "text/html";
        obj.style.width = "100%";

        const caption = document.createElement("figcaption");
        caption.textContent = x[1];
        caption.style.fontSize = "0.9rem";
        caption.style.marginTop = "0.5rem";

        wrapper.appendChild(obj);
        wrapper.appendChild(caption);
        gallery.appendChild(wrapper);
    }); 
});

/*
 * first のパラメータが指定されているときは自動入力して表示する
 */
const urlSearch = new URLSearchParams(document.location.search);
if (urlSearch.get('first')) {
	urlMantela.value = urlSearch.get('first');
	btnGenerate.click();
}