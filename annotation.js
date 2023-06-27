$(".annotation").each((_, ele) => {
	const popup = new OO.ui.PopupWidget({
		$content: $(ele).children(".annotation-content"),
		padded: true,
		autoFlip: false,
	});
	$(ele)
		.append(popup.$element)
		.on("mouseover", () => {
			popup.toggle(true);
			const _popup = popup.$element;
			const bpopupPos = [_popup[0].offsetLeft, _popup[0].offsetTop];
			$(_popup).css({
				position: "absolute",
				left: bpopupPos[0],
				top: bpopupPos[1],
				backgroundColor: "#FF0",
			});
			$("body").append(_popup);
		})
		.on("mouseout", () => {
			popup.toggle(false);
		});
});
