function JQ(element, classes, id, src, href)    {
    this.classes = () => {
        if (typeof(classes) === "string")  {return classes;} else {Array.isArray(classes) ? classes: [classes]; return classes.join(" ");};};
    this.DOMref = () => {
        var createElement = $("<"+element+">");
		if (typeof(classes) != "undefined" || "null" || "number" || "function")	{createElement.addClass(this.classes());};
		if (typeof(id) != "undefined" || "null" || "number" || "function")	{createElement.attr("id", id)};
        if (typeof(src) != "undefined" || "null" || "number" || "function")  {createElement.attr("src", src);};
        if (typeof(href) != "undefined" || "null" || "number" || "function")  {createElement.attr("href", href);};
        this.DOMref = createElement; return $(this.DOMref[0]);};
		return this.DOMref();
};