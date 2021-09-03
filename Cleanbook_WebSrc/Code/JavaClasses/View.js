class View {

    static VISIBLE = 0;
    static INVISIBLE = 1;
    static GONE = 2;

    constructor(ele, activity) {
        this.ele = ele;
        this.activity = activity;
    }

    getVisibility() {
        if (this.ele.style.display != "none" && this.ele.style.opacity != 0)
            return View.VISIBLE;

        if (this.ele.style.display != "none" && this.ele.style.opacity == 0)
            return View.INVISIBLE;

        if (this.ele.style.display == "none")
            return View.GONE;
    }

    setVisibility(type) {
        switch (type) {
            case View.VISIBLE:
                this.ele.style.display = "";
                this.ele.style.opacity = 1;
                break;
            case View.INVISIBLE:
                this.ele.style.display = "";
                this.ele.style.opacity = 0;
                break;
            case View.GONE:
                this.ele.style.display = "none";
                this.ele.style.opacity = 1;
                break;
        }
    }

    isChecked() {
        return this.ele.checked;
    }

    setChecked(bool) {
        this.ele.checked = bool;
    }

    getInputType() {
        if (this.ele.disabled)
            return InputType.TYPE_NULL;

        if (this.ele.type == "text")
            return InputType.TYPE_CLASS_TEXT;

        if (this.ele.type == "password")
            return InputType.TYPE_TEXT_VARIATION_PASSWORD;

        if (this.ele.type == "email")
            return InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
    }

    setInputType(type) {
        if (type == InputType.TYPE_NULL) {
            this.ele.disabled = true;
        } else {
            this.ele.disabled = false;
        }

        if (type == InputType.TYPE_CLASS_TEXT) {
            this.ele.type = "text";
        }

        if (type == InputType.TYPE_CLASS_PHONE) {
            this.ele.type = "text";
        }

        if (type == InputType.TYPE_TEXT_VARIATION_PASSWORD) {
            this.ele.type = "password";
        }

        if (type == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS) {
            this.ele.type = "email";
        }
    }

    addEventListener(type, func) {
        if (this.ele.eventListenerMap == null)
            this.ele.eventListenerMap = new Map();
        if (this.ele.eventListenerMap.has(type)) {
            this.ele.removeEventListener(type, this.ele.eventListenerMap.get(type));
            console.log(this.ele.id + "|had event listener |" + type + "| removed");
        }
        this.ele.eventListenerMap.set(type, func);
        this.ele.addEventListener(type, func);
    }

    setHint(hint) {
        this.ele.placeHolder = hint;
    }

    setText(text) {
        if (this.ele.tagName == "INPUT" || this.ele.tagName == "TEXTAREA")
            this.ele.value = text;
        else
            this.ele.innerHTML = text;
    }

    setValue(value) {
        this.ele.value = value;
    }

    getContext() {
        return this.activity;
    }

    getText() {
        if (this.ele.tagName == "INPUT" || this.ele.tagName == "TEXTAREA")
            return this.ele.value;
        else
            return this.ele.innerHTML;
    }

    setTextIsSelectable(bool) {
        this.ele.disabled = !bool;
    }

    setAdapter(arrayAdapter) {
        if (typeof arrayAdapter.aa_list[0] == "string") { //Select
            if (arrayAdapter.aa_list.length > 0) {
                var html = "";
                for (let name of arrayAdapter.aa_list) {
                    html += "<option>" + name + "</option>";
                }
                this.ele.innerHTML = html;
            }
        }
        else {
            this.ele.innerHTML = "";
            var nodes = arrayAdapter.getHTMLNodes();
            for (let node of nodes) {
                this.ele.appendChild(node);
            }
        }
        // this.ele.innerHTML = arrayAdapter.getHTML();
        // arrayAdapter.htmlSecondPass(this.ele);
    }

    updateAdapterLastItem(arrayAdapter) {
        this.ele.appendChild(arrayAdapter.getLastNode());
    }

    setBackgroundResource(path) {
        this.ele.src = path;
    }

    findViewById(id) {
        var ele = W4_Funcs.getElementInsideElement(this.ele, id)
        if (ele == null) {
            console.log("Failed to find|" + id + "| in ele|" + this.ele.id + "|");
            return null;
        }
        return new View(ele, this.activity);
    }

    setTextColor(color) {
        this.ele.style.color = color;
    }

    getSelectedItemPosition() {
        return this.ele.selectedIndex;
    }

    setSelection(index) {
        this.ele.selectedIndex = index;
    }

    setClickable(bool) {
        this.ele.disabled = !bool;
    }

    addView(view, i) {
        if (i != null)
            this.ele.insertBefore(view.ele, this.ele.children[i]);
        else
            this.ele.appendChild(view.ele);
    }

    removeView(view) {
        this.ele.removeChild(view.ele);
    }

    removeAllViews() {
        this.ele.innerHTML = "";
        // for (let node of this.ele.children) {
        //     this.ele.removeChild(node);
        // }
    }

    indexOfChild(view) {
        var i = 0;
        var child = view.ele;
        while ((child = child.previousSibling) != null)
            i++;
        return i;
    }

    setImageResource(src) {
        this.ele.src = src;
    }

    getChildCount() {
        return this.ele.children.length;
    }

    getChildAt(i) {
        return new View(this.ele.children[i], this.activity);
    }

    getId() {
        return this.ele.id;
    }

    setTextAlignment() {
    }

    setAllCaps() {
    }

    setBackgroundColor(color) {
        this.ele.style.backgroundColor = color;
    }

    setTextSize(size) {
        this.ele.style.fontSize = size + "px";
    }
}