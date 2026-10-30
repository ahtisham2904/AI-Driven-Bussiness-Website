// Stridely website scripts: menu, product filter, order form, landing variants
(function () {
  "use strict";

  // 1. Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // 2. Product filters (category + budget)
  var grid = document.getElementById("grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product"));
    var chips = document.querySelectorAll(".chip[data-filter]");
    var budget = document.getElementById("budget");
    var budgetOut = document.getElementById("budgetOut");
    var count = document.getElementById("count");
    var empty = document.getElementById("empty");
    var category = "all";

    var apply = function () {
      var max = Number(budget.value);
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (category === "all" || c.dataset.cat === category) && Number(c.dataset.price) <= max;
        c.hidden = !ok;
        if (ok) shown++;
      });
      budgetOut.textContent = "Rs. " + max.toLocaleString("en-US");
      count.textContent = "Showing " + shown + " of " + cards.length + " shoes";
      empty.hidden = shown !== 0;
    };

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        category = chip.dataset.filter;
        apply();
      });
    });
    budget.addEventListener("input", apply);
    apply();
  }

  // 3. Order form: prefill from ?product= and validate
  var form = document.getElementById("orderForm");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("product");
    var productSel = document.getElementById("product");
    if (wanted) {
      for (var i = 0; i < productSel.options.length; i++) {
        if (productSel.options[i].text === wanted) { productSel.selectedIndex = i; break; }
      }
    }
    var msg = document.getElementById("formMsg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var product = productSel.value;
      var size = document.getElementById("size").value;
      var pay = document.getElementById("pay").value;
      msg.className = "form-msg";
      if (!product || !size || !pay) {
        msg.classList.add("error");
        msg.textContent = "Please choose a shoe, a size and a payment method.";
        return;
      }
      msg.classList.add("ok");
      msg.textContent = "Thank you. Your demo enquiry for " + product + " (size " + size + ", " + pay.toLowerCase() + ") is ready. Nothing was sent or saved.";
      form.reset();
    });
  }

  // 4. Landing page headline/CTA variants (A/B comparison for the assignment)
  var head = document.getElementById("lhead");
  if (head) {
    var cta = document.getElementById("lcta");
    var info = document.getElementById("vinfo");
    var versions = {
      A: { h: "Step Into Comfort", c: "Buy Your Sneakers Today" },
      B: { h: "Walk to Class in All-Day Comfort", c: "Find My Size" }
    };
    var buttons = document.querySelectorAll(".chip[data-v]");
    var show = function (v) {
      head.textContent = versions[v].h;
      cta.textContent = versions[v].c;
      info.textContent = "Showing Variant " + v + ": headline “" + versions[v].h + "” with the button “" + versions[v].c + "”.";
      buttons.forEach(function (b) { b.classList.toggle("active", b.dataset.v === v); });
    };
    buttons.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.v); }); });
    var start = (new URLSearchParams(window.location.search).get("v") || "A").toUpperCase();
    show(versions[start] ? start : "A");
  }
})();
