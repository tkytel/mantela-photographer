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

	const media = [];
	const seen = new Set();

	mantelas.forEach(v => {
		v.extensions.map(x => {
			if (!('image' in x)) {
				return;
			}

			if (!seen.has(x.image)) {
				desc = x.name + ', ' + x.extension + ' on ';
				desc += v.aboutMe.name + ' ';
				desc += '(' + v.aboutMe.identifier + ')';

				seen.add(x.image);
				media.push([
					x.image,
					desc,
				]);
			}
		});

		if ('image' in v.aboutMe) {
			desc = v.aboutMe.name + ' ';
			desc += '(' + v.aboutMe.identifier + ')';

			seen.add(v.aboutMe.image);
			media.push([
				v.aboutMe.image,
				desc,
			]);
		}
	});

	const gallery = document.getElementById("gallery");

	const isVideo = (url) => /\.mp4$/i.test(url);

	media.map(x => {
		const wrapper = document.createElement("figure");
		wrapper.style.margin = "1rem 0";
		const caption = document.createElement("figcaption");
		caption.textContent = x[1];
		caption.style.fontSize = "0.9rem";
		caption.style.marginTop = "0.5rem";

		if (isVideo(x[0])) {
			const vidWrapper = document.createElement("div");
			vidWrapper.style.position = "relative";
			vidWrapper.style.cursor = "pointer";

			const video = document.createElement("video");
			video.src = x[0];
			video.volume = 0;
			video.controls = true;
			video.autoplay = true;
			video.loading = "lazy";
			video.style.width = "100%";
			vidWrapper.appendChild(video)

			vidWrapper.addEventListener("click", () => {
				const modal = document.getElementById("modal");
				const modalImg = document.getElementById("modalImage");

				modalImg.replaceWith(modalImg.cloneNode());
				const modalObj = document.createElement("video");
				modalObj.src = obj.data;
				modalObj.style.Width = "100%";
				modalObj.style.maxHeight = "60vh";
				modalObj.style.border = "4px solid white";
				modalObj.style.backgroundColor = "#fff";
				modalObj.style.objectFit = "contain";
				modalObj.controls = true;
				modalObj.video = 0;
				modalObj.setAttribute("loading", "lazy");
				modalObj.id = "modalImage";

				document.getElementById("modal").replaceChild(modalObj, document.getElementById("modalImage"));
				modal.style.display = "flex";

				const modalCaption = document.getElementById("modalCaption");
				modalCaption.innerText = x[1];
			});
			
			wrapper.appendChild(vidWrapper);
		} else {
			const objWrapper = document.createElement("div");
			objWrapper.style.position = "relative";
			objWrapper.style.cursor = "pointer";

			const obj = document.createElement("object");
			obj.data = x[0];
			obj.loading = "lazy";
			obj.style.width = "100%";
			obj.style.height = "auto";
			objWrapper.appendChild(obj);

			objWrapper.addEventListener("click", () => {
				const modal = document.getElementById("modal");
				const modalImg = document.getElementById("modalImage");

				modalImg.replaceWith(modalImg.cloneNode());
				const modalObj = document.createElement("object");
				modalObj.data = obj.data;
				modalObj.style.Width = "100%";
				modalObj.style.maxHeight = "60vh";
				modalObj.style.border = "4px solid white";
				modalObj.style.backgroundColor = "#fff";
				modalObj.style.objectFit = "contain";
				modalObj.setAttribute("loading", "lazy");

				modalObj.id = "modalImage";
				document.getElementById("modalImageWrapper").replaceChild(modalObj, document.getElementById("modalImage"));
				modal.style.display = "flex";

				const modalCaption = document.getElementById("modalCaption");
				modalCaption.innerText = x[1];
			});

			wrapper.appendChild(objWrapper);
			wrapper.appendChild(caption);
		}

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

document.getElementById("modalClose").addEventListener("click", () => {
	document.getElementById("modal").style.display = "none";
});