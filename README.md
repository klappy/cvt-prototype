# cvt-prototype
Constant Value Target Trading. Given a trading pair, maintain a constant value target in the traded asset, using the primary currency as the reserve. This simplifies the fundamental principle of buy low and sell high. When the value of the target increases by x percent, selling x percent trims off the earnings, placing it in the reserves in order to buy x percent when the target decreases by x percent. Each buy and sell resets the value to the target amount.

![Constant Value Target Trading Workflow Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQVNVg6V44yycFtQFDnHAyLOJa64gMtAvfE9vQeF28ro68f0X6AHptuiPlFeE6U1r1MdazGFswLRC69/pub?w=713&amp;h=1046)
