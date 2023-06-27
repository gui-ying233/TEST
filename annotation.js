$(".annotation").each((_, ele) => {
	const popup = new OO.ui.PopupWidget({
		$content: $(ele).children(".annotation-content"),
		padded: true,
		autoFlip: false,
	});
	const _popup = $(popup.$element);
	_popup.css({
		position: "absolute",
		left: _popup.offset.left,
		top: _popup.offset.top,
	});
	$("body").append(_popup.$element);
	$(ele)
		.append(popup.$element)
		.on("mouseover", async () => {
			popup.toggle(true);
		})
		.on("mouseout", () => {
			popup.toggle(false);
		});
});
