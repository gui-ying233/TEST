"use strict";
// @todo 多选
// @todo 连线

if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	console.warn("拒绝使用傻逼 Safari 浏览器从你我做起");
}

if (
	mw.config.get("wgNamespaceNumber") === 14 &&
	mw.config.get("wgAction") === "view"
) {
	mw.util.addCSS(`.CatnipPanel {
	position: fixed;
	left: 6.25vw;
	top: 6.25vh;
	width: 87.5vw;
	height: 87.5vh;
	z-index: 9999;
	background-color: #2e3440;
	overflow: hidden;
	border-radius: 0.5em;
	box-shadow: rgba(15, 17, 21, 0.2) 0px 3px 6px 0px;
	transition: box-shadow 350ms ease-in-out;
}
.CatnipPanel:hover {
	box-shadow: rgba(15, 17, 21, 0.2) 0px 10px 20px 2px;
}
.CatnipPanelInner {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100vw;
	height: 100vh;
	transform: translate(-50%, -50%);
	overflow: visible;
}

.CatnipCat {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	background-color: #3b4252;
	color: #d8dee9;
	padding: 0.8em;
	border-radius: 0.5em;
	box-shadow: rgba(15, 17, 21, 0.2) 0px 3px 6px 0px;
	white-space: nowrap;
	user-select: none;
	-webkit-user-select: none;
	transition: box-shadow 250ms ease-in-out;
}
.CatnipCat:hover {
	text-decoration: none;
	box-shadow: rgba(15, 17, 21, 0.2) 0px 10px 20px 2px;
}
.CatnipCat:active {
	color: #eceff4;
	box-shadow: rgba(15, 17, 21, 0.2) 0px 3px 6px 0px;
}

.CatnipParentCat {
	left: 20%;
}
.CatnipCurrentCat {
	left: 50%;
}
.CatnipSubCat {
	left: 80%;
}

.CatnipCat::before,
.CatnipCat::after {
	content: "";
	position: absolute;
	top: 50%;
	display: inline-block;
	width: 0.55em;
	height: 0.55em;
	background-color: #d8dee9;
	border-radius: 50%;
}
.CatnipCat::before {
	left: 0;
	transform: translate(-50%, -50%);
}
.CatnipCat::after {
	right: 0;
	transform: translate(50%, -50%);
}`);

	function noDefault(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function clickCat(e) {
		noDefault(e);
		if (e.shiftKey) {
			// @todo 连线
		} else {
			// @todo 单选
		}
	}

	async function creatCatnip() {
		const api = new mw.Api();

		let parentCats, subCats;

		const cat = mw.config.get("wgTitle");

		await api
			.get({
				action: "query",
				format: "json",
				prop: "categories",
				list: "categorymembers",
				titles: `Category:${cat}`,
				utf8: 1,
				formatversion: 2,
				cmtitle: `Category:${cat}`,
				cmprop: "title",
				cmnamespace: 14,
				cmtype: "subcat",
				cmlimit: "max",
			})
			.done((d) => {
				parentCats = d.query.pages[0].categories.map((e) =>
					e.title.slice(9)
				);
				subCats = d.query.categorymembers.map((e) => e.title.slice(9));
			});

		const currentCat = document.createElement("a");
		currentCat.innerText = cat;
		currentCat.classList.add("CatnipCat", "CatnipCurrentCat");

		// @todo 拖动
		parentCats = parentCats.map((e) => {
			const parentCat = document.createElement("a");
			parentCat.innerText = e;
			parentCat.classList.add("CatnipCat", "CatnipParentCat");
			parentCat.onclick = (e) => clickCat(e);
			parentCat.ondblclick = (e) => {
				noDefault(e);
				parentCat.remove();
				parentCats = parentCats.filter((e) => e !== parentCat);
			};
			return parentCat;
		});
		subCats = subCats.map((e) => {
			const subCat = document.createElement("a");
			subCat.innerText = e;
			subCat.classList.add("CatnipCat", "CatnipSubCat");
			subCat.onclick = (e) => clickCat(e);
			subCat.ondblclick = (e) => {
				noDefault(e);
				subCat.remove();
				subCats = subCats.filter((e) => e !== subCat);
			};
			return subCat;
		});

		for (var i = 0; i < parentCats.length; i++) {
			parentCats[i].style.top = `calc(${
				(i - Math.floor(parentCats.length / 2)) * 5
			}em + 50%)`;
		}
		for (let i = 0; i < subCats.length; i++) {
			subCats[i].style.top = `calc(${
				(i - Math.floor(subCats.length / 2)) * 5
			}em + 50%)`;
		}

		const panelInner = document.createElement("div");
		panelInner.classList.add("CatnipPanelInner");
		panelInner.style.zoom = 1;
		panelInner.style.transform = `translate(-50%, -50%)`;
		panelInner.append(...parentCats, currentCat, ...subCats);

		const panel = document.createElement("div");
		panel.classList.add("CatnipPanel");
		panel.appendChild(panelInner);
		panel.onwheel = (e) => {
			noDefault(e);
			if (e.ctrlKey) {
				panelInner.style.zoom = Math.min(
					Math.max(0.2, panelInner.style.zoom - e.deltaY / 250),
					5
				);
			} else {
				let transform = panelInner.style.transform
					.replace(/^translate\((.+?)%, (.+?)%\)/, "$1,$2")
					.split(",")
					.map((e) => parseFloat(e));
				panelInner.style.transform = `translate(${
					transform[0] - e.deltaX / 50 / panelInner.style.zoom
				}%, ${transform[1] - e.deltaY / 50 / panelInner.style.zoom}%)`;
			}
		};
		panel.ondblclick = (e) => {
			noDefault(e);
			const catName = prompt("CAT:")?.replace(
				/^[\s_]*(.+?)[\s_]*$/,
				"$1"
			);
			if (!catName) return;
			const cat = document.createElement("a");
			cat.innerText = catName;
			cat.classList.add("CatnipCat");
			const transform = panelInner.style.transform
				.replace(/^translate\((.+?)%, (.+?)%\)/, "$1,$2")
				.split(",")
				.map((e) => parseFloat(e));
			console.log(
				e.clientX,
				(e.clientX * 100) / window.innerWidth - transform[0] - 50,
				panelInner.style.zoom
			);
			cat.style.left = `${
				(e.clientX * 100) / window.innerWidth - transform[0] - 50
			}%`;
			cat.style.top = `${
				(e.clientY * 100) / window.innerHeight - transform[1] - 50
			}%`;

			cat.onclick = (e) => clickCat(e);
			cat.ondblclick = (e) => {
				noDefault(e);
				cat.remove();
			};
			panelInner.appendChild(cat);
		};

		panel.onmousemove = (e) => {
			if (
				(e.target.classList.contains("CatnipPanelInner") ||
					e.target.classList.contains("CatnipPanel")) &&
				e.buttons === 1 &&
				e.button === 0
			) {
				let transform = panelInner.style.transform
					.replace(/^translate\((.+?)%, (.+?)%\)/, "$1,$2")
					.split(",")
					.map((e) => parseFloat(e));
				panelInner.style.transform = `translate(${
					transform[0] + (e.movementX / panelInner.style.zoom) * 0.1
				}%, ${
					transform[1] + (e.movementY / panelInner.style.zoom) * 0.1
				}%)`;
			}
		};

		window.onkeydown = (e) => {
			let transform = panelInner.style.transform
				.replace(/^translate\((.+?)%, (.+?)%\)/, "$1,$2")
				.split(",")
				.map((e) => parseFloat(e));
			switch (e.key) {
				case "ArrowUp":
					noDefault(e);
				case "w":
				case "W":
					panelInner.style.transform = `translate(${transform[0]}%, ${
						transform[1] + 5 / panelInner.style.zoom
					}%)`;
					break;
				case "ArrowDown":
					noDefault(e);
				case "s":
				case "S":
					panelInner.style.transform = `translate(${transform[0]}%, ${
						transform[1] - 5 / panelInner.style.zoom
					}%)`;
					break;
				case "ArrowLeft":
					noDefault(e);
				case "a":
				case "A":
					panelInner.style.transform = `translate(${
						transform[0] + 5 / panelInner.style.zoom
					}%, ${transform[1]}%)`;
					break;
				case "ArrowRight":
					noDefault(e);
				case "d":
				case "D":
					panelInner.style.transform = `translate(${
						transform[0] - 5 / panelInner.style.zoom
					}%, ${transform[1]}%)`;
					break;
				case "H":
					noDefault(e);
					panelInner.style.zoom = 1;
				case "h":
					noDefault(e);
					panelInner.style.transform = `translate(-50%, -50%)`;
					break;
				case "s":
				case "S":
					noDefault(e);
					if (e.ctrlKey) {
						// @todo 保存
					}
					break;
				case "Escape":
					panel.remove();
					break;
			}
		};

		document.body.appendChild(panel);
	}

	$(
		mw.util
			.addPortletLink(
				"p-cactions",
				"javascript:void(0);",
				"猫薄荷",
				"ca-Catnip"
			)
			.addEventListener("click", creatCatnip)
	);
}
