(function ($) {
    function StockMock() {
        var $this = this;
        var positionItems = [], stockItem = [], segmentItem = [], optionTypeItem = [], actionTypeItem = [],
            expiryTypeItem = [], selectedPosition = {}, allPositions = [], strikePrice = {}, closestPremium = {},
            lotSize = { nifty: 75, banknifty: 20, finnifty: 40 }

        function initilizeModel() {
            onChangeinput("entryType");

            $("#add_position").on('click', function () {
                allPositions.push(JSON.parse(JSON.stringify(selectedPosition)));
                $('.__position__box__container').empty();
                addPosition();
            });

        }

        function onChangeinput(radioName) {
            $(`input[name=${radioName}]`).on('change', function () {
                selectedPosition[radioName] = $(this).val();
                if (radioName == 'entryType' || radioName == 'segment') {
                    BindPositionItems();
                } else if (radioName == 'stock') {
                    var seletName = selectedPosition.entryType == "atm" ? 'strikePrice' : 'closestPremium';
                    var $that = $(`select[name=${seletName}]`);
                    $that.empty();
                    var range = selectedPosition.entryType == "atm" ? strikePrice[selectedPosition.stock] : closestPremium[selectedPosition.stock];
                    for (var j = 0; j < range.length; j++) {
                        var item = range[j];
                        $('<option/>', {
                            value: item,
                            html: selectedPosition.entryType == "atm" ? (item < 0 ? `ATM${item}` : item > 0 ? `ATM+${item}` : `ATM`) : item
                        }).appendTo($that);
                    }
                    $that.val(selectedPosition[seletName]);
                }

            });
        }

        function onChangeSelect(radioName) {
            $(`select[name=${radioName}]`).on('change', function () {
                selectedPosition[radioName] = $(this).val();
            });
        }

        function BindData() {

            selectedPosition = {
                entryType: "atm",
                stock: "banknifty",
                segment: "futures",
                optionType: "call",
                actionType: "buy",
                strikePrice: 0,
                closestPremium: 25,
                totalLot: 1,
                expiryType: "weekly",
                premiumRange: [100, 200],
                targetProfit: { status: !1, type: "tpp", value: "" },
                stopLoss: { status: !1, type: "slp", value: "" }
            };

            strikePrice = {
                nifty: [-500, -450, -400, -350, -300, -250, -200, -150, -100, -50, 0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
                banknifty: [-1e3, -900, -800, -700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1e3],
                finnifty: [-1e3, -900, -800, -700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1e3],
            };

            closestPremium = {
                nifty: [5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300],
                banknifty: [5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500],
                finnifty: [5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500],
            };


            stockItem = ['nifty', 'banknifty'];

            segmentItem = ['futures', 'options'];

            optionTypeItem = ['call', 'put'];

            actionTypeItem = ['buy', 'sell'];

            expiryTypeItem = ['weekly', 'monthly'];

            positionItems = [
                { parent: ['atm', 'cp'], title: 'Select Index', name: 'stock', type: 'radio', items: stockItem },
                { parent: ['atm'], title: 'Select Segment', name: 'segment', type: 'radio', items: segmentItem },
                { parent: ['options', 'cp'], title: 'Option Type', name: 'optionType', type: 'radio', items: optionTypeItem },
                { parent: ['atm', 'cp'], title: 'Action Type', name: 'actionType', type: 'radio', items: actionTypeItem },
                { parent: ['options'], title: 'Strike Price', name: 'strikePrice', type: 'select', range: strikePrice.banknifty },
                { parent: ['cp'], title: 'Closest Premium', name: 'closestPremium', type: 'select', range: closestPremium.banknifty },
                { parent: ['atm'], title: 'Total Lot', name: 'totalLot', type: 'number' },
                { parent: ['options', 'cp'], title: 'Expiry Type', name: 'expiryType', type: 'radio', items: expiryTypeItem }
            ];

        }

        function BindScheme() {
            $("input[name=entryType][value='" + selectedPosition.entryType + "']").prop("checked", true);
            for (var i = 0; i < positionItems.length; i++) {
                var $positionItem = positionItems[i];
                switch ($positionItem.type) {
                    case 'radio':
                        $(`input[name=${$positionItem.name}][value='${selectedPosition[$positionItem.name]}']`).prop("checked", true);
                        onChangeinput($positionItem.name)
                        break;
                    case 'number':
                        $(`input[name=${$positionItem.name}]`).val(selectedPosition[$positionItem.name]);
                        onChangeinput($positionItem.name)
                        break;
                    case 'select':
                        $(`select[name=${$positionItem.name}]`).val(selectedPosition[$positionItem.name]);
                        onChangeSelect($positionItem.name)
                        break;
                    default:
                }



            }
        }

        function BindPositionItems() {

            var $positionItems = positionItems.filter(function (item) {
                return (item.parent.filter(function (p) {
                    return (p == selectedPosition.entryType) || (p == selectedPosition.segment && selectedPosition.entryType == 'atm');
                })).length > 0
            });

            var $div = $('<div/>', {
                'class': 'row',
                html: function () {
                    for (var i = 0; i < $positionItems.length; i++) {
                        var $position = $positionItems[i];
                        $('<div/>', {
                            'class': 'col-lg col-md-12 col-sm-12 position_col',
                            html: function () {
                                $('<div/>', {
                                    'class': '__input__label',
                                    html: $position.title + " :"
                                }).appendTo($(this));

                                switch ($position.type) {
                                    case 'radio':
                                        $('<div/>', {
                                            'class': '__input__type__radio',
                                            html: function () {
                                                for (var j = 0; j < $position.items.length; j++) {
                                                    var item = $position.items[j];
                                                    $('<label/>', {
                                                        html: function () {
                                                            $('<input/>', {
                                                                'type': $position.type,
                                                                'name': $position.name,
                                                                'value': item,
                                                                'checked': selectedPosition[$position.type] == item
                                                            }).appendTo($(this));

                                                            $('<div/>', {
                                                                html: item
                                                            }).appendTo($(this));
                                                        }
                                                    }).appendTo($(this));
                                                }

                                            }
                                        }).appendTo($(this));

                                        break;
                                    case 'select':
                                        $('<select/>', {
                                            'class': '__box__input',
                                            'name': $position.name,
                                            html: function () {
                                                var range = $position.name == "strikePrice" ? strikePrice[selectedPosition.stock] : closestPremium[selectedPosition.stock];
                                                for (var j = 0; j < range.length; j++) {
                                                    var item = range[j];
                                                    $('<option/>', {
                                                        value: item,
                                                        html: $position.name == "strikePrice" ? (item < 0 ? `ATM${item}` : item > 0 ? `ATM+${item}` : `ATM`) : item
                                                    }).appendTo($(this));
                                                }

                                            }
                                        }).appendTo($(this));
                                        break;
                                    case 'number':
                                        $('<input/>', {
                                            'type': 'number',
                                            'class': '__box__input',
                                            'placeholder': '0',
                                            'min': 1,
                                            'name': $position.name
                                        }).appendTo($(this));
                                        break;
                                }

                            }

                        }).appendTo($(this));
                    }
                }
            })
            $("#rowdata").html($div);
            BindScheme();
        }

        function addPosition() {
            allPositions.map(function (p, i) {
                addPositionRow(p, i);
                $(`input[name=leg_stock_${i}][value='${p.stock}']`).prop("checked", true);
                dynamicRadioChange(i);
            });

            AddNewevents();

        }

        function addPositionRow(positionObj, i) {

            $("<div/>", {
                class: '__position__box row',
                id: 'po_row_' + i,
                html: function () {
                    $("<div/>", {
                        class: 'col',
                        html: function () {
                            $("<label/>", {
                                class: 'checkbox-container',
                                html: function () {
                                    $("<div/>", {
                                        class: 'checkbox-label',
                                        html: function () {
                                            $("<input/>", {
                                                type: 'checkbox',
                                            }).appendTo(this);
                                            $("<span/>", {
                                                class: 'checkbox-custom',
                                            }).appendTo(this);
                                        }
                                    }).appendTo(this);
                                }
                            }).appendTo(this);
                        }
                    }).appendTo(this);

                    $("<div/>", {
                        class: 'col',
                        html: function () {
                            $("<div/>", {
                                class: '__position__details',

                                html: function () {
                                    $("<div/>", {
                                        class: '__left__align__leginfo',
                                        html: function () {
                                            $("<div/>", {
                                                class: 'total_lot',
                                                'data-val': 'sp_total_lot',
                                                'data-index': i,
                                                'data-name': 'totalLot',
                                                style: 'text-transform: lowercase; padding: 0px;',
                                                html: function () {

                                                    $("<span/>", {
                                                        class: 'sp_total_lot',
                                                        text: positionObj.totalLot
                                                    }).appendTo(this);

                                                    $('<div/>', {
                                                        class: '__arrow__control',
                                                        html: function () {
                                                            $('<a/>', {
                                                                class: 'fa fa-sort-asc __up__arrow rowarrow'

                                                            }).appendTo(this);
                                                            $('<a/>', {
                                                                class: 'fa fa-sort-desc __down__arrow rowarrow'
                                                            }).appendTo(this);
                                                        }
                                                    }).appendTo(this);

                                                    $("<span/>", {
                                                        style: 'padding: 2.5px 0px 0px 3px; transform: rotate(45deg); font-size: 14px; text-transform: capitalize;',
                                                        text: 'Lots'
                                                    }).appendTo(this);

                                                }
                                            }).appendTo(this);

                                            $('<div/>', {
                                                title: 'Click to change',
                                                class: 'position__button',
                                                'data-index': i,
                                                'data-name': 'actionType',
                                                html: positionObj.actionType,
                                            }).appendTo(this);
                                            if (positionObj.entryType == 'atm' && positionObj.segment == 'futures') {

                                                $('<div/>', {
                                                    class: 'strike_price',
                                                    html: positionObj.segment
                                                }).appendTo(this);

                                            } else {
                                                if (positionObj.entryType == 'atm') {
                                                    $('<div/>', {
                                                        class: 'strike_price',
                                                        'data-val': 'sp_strikePrice',
                                                        'data-index': i,
                                                        'data-name': 'strikePrice',
                                                        html: function () {
                                                            $('<span/>', {
                                                                class: 'sp_strikePrice',
                                                                text: (positionObj.strikePrice < 0 ? `ATM${positionObj.strikePrice}` : positionObj.strikePrice > 0 ? `ATM+${positionObj.strikePrice}` : `ATM`)
                                                            }).appendTo(this);

                                                            $('<div/>', {
                                                                class: '__arrow__control',
                                                                html: function () {
                                                                    $('<a/>', {
                                                                        class: 'fa fa-sort-asc __up__arrow rowarrow'
                                                                    }).appendTo(this);
                                                                    $('<a/>', {
                                                                        class: 'fa fa-sort-desc __down__arrow rowarrow'
                                                                    }).appendTo(this);
                                                                }
                                                            }).appendTo(this);

                                                        }
                                                    }).appendTo(this);
                                                } else {
                                                    $('<div/>', {
                                                        class: 'strike_price',
                                                        'data-val': 'sp_closestPremium',
                                                        'data-index': i,
                                                        'data-name': 'closestPremium',
                                                        html: function () {
                                                            $('<span/>', {
                                                                class: 'sp_closestPremium',
                                                                text: `~${positionObj.closestPremium} pt`
                                                            }).appendTo(this);

                                                            $('<div/>', {
                                                                class: '__arrow__control',
                                                                html: function () {
                                                                    $('<a/>', {
                                                                        class: 'fa fa-sort-asc __up__arrow rowarrow'
                                                                    }).appendTo(this);
                                                                    $('<a/>', {
                                                                        class: 'fa fa-sort-desc __down__arrow rowarrow'
                                                                    }).appendTo(this);
                                                                }
                                                            }).appendTo(this);

                                                        }
                                                    }).appendTo(this);
                                                }
                                                $('<div/>', {
                                                    title: 'Click to change',
                                                    class: 'position__button',
                                                    'data-index': i,
                                                    'data-name': 'optionType',
                                                    html: positionObj.optionType
                                                }).appendTo(this);
                                            }

                                        }
                                    }).appendTo(this);

                                    $("<div/>", {
                                        class: '__right__align__leginfo',
                                        html: function () {
                                            $("<div/>", {
                                                class: 'add__leg__tpsl',
                                                html: function () {
                                                    if (positionObj.targetProfit.status) {
                                                        addTargetProfit(this, 'targetprofit', i);
                                                    } else {
                                                        $('<label/>', {
                                                            class: 'checkbox-container addinput',
                                                            'data-name': 'targetprofit',
                                                            'data-index': i,
                                                            html: function () {
                                                                $('<div/>', {
                                                                    class: 'checkbox-label',
                                                                    html: function () {
                                                                        $('<input/>', {
                                                                            type: 'checkbox',
                                                                            value: false
                                                                        }).appendTo(this);
                                                                        $('<span/>', {
                                                                            class: 'fa fa-plus fa__add'
                                                                        }).appendTo(this);
                                                                    }

                                                                }).appendTo(this);

                                                                $('<div/>', {
                                                                    class: 'checkbox__title',
                                                                    html: 'Target Profit'

                                                                }).appendTo(this);
                                                            }
                                                        }).appendTo(this);
                                                    }
                                                }
                                            }).appendTo(this);

                                            $("<div/>", {
                                                class: 'add__leg__tpsl',
                                                html: function () {
                                                    if (positionObj.stopLoss.status) {
                                                        addStopLoss(this, 'targetprofit', i);
                                                    } else {
                                                        $('<label/>', {
                                                            class: 'checkbox-container addinput',
                                                            'data-name': 'stoploss',
                                                            'data-index': i,
                                                            html: function () {
                                                                $('<div/>', {
                                                                    class: 'checkbox-label',
                                                                    html: function () {
                                                                        $('<input/>', {
                                                                            type: 'checkbox',
                                                                            value: false
                                                                        }).appendTo(this);
                                                                        $('<span/>', {
                                                                            class: 'fa fa-plus fa__add'
                                                                        }).appendTo(this);
                                                                    }

                                                                }).appendTo(this);

                                                                $('<div/>', {
                                                                    class: 'checkbox__title',
                                                                    html: 'Stop Loss'

                                                                }).appendTo(this);
                                                            }
                                                        }).appendTo(this);
                                                    }
                                                }
                                            }).appendTo(this);

                                            $("<div/>", {
                                                class: 'add__leg__tpsl trailing__box',
                                                html: function () {
                                                    $('<label/>', {
                                                        class: 'checkbox-container addinput',
                                                        'data-name': 'trailstoploss',
                                                        'data-index': i,
                                                        html: function () {
                                                            $('<div/>', {
                                                                class: 'checkbox-label',
                                                                html: function () {
                                                                    $('<input/>', {
                                                                        type: 'checkbox',
                                                                        value: false
                                                                    }).appendTo(this);
                                                                    $('<span/>', {
                                                                        class: 'fa fa-plus fa__add'
                                                                    }).appendTo(this);
                                                                }

                                                            }).appendTo(this);

                                                            $('<div/>', {
                                                                class: 'checkbox__title',
                                                                html: 'Trail Stop Loss'

                                                            }).appendTo(this);
                                                        }
                                                    }).appendTo(this);
                                                }
                                            }).appendTo(this);

                                            $('<div/>', {
                                                class: '__input__type__radio',
                                                html: function () {
                                                    $('<label/>', {
                                                        html: function () {
                                                            $('<input/>', {
                                                                name: 'leg_stock_' + i,
                                                                calss: 'position_leg_stock',
                                                                'data-index': i,
                                                                type: 'radio',
                                                                value: 'nifty'
                                                            }).appendTo(this);

                                                            $('<div/>', {
                                                                html: 'N'
                                                            }).appendTo(this);
                                                        }
                                                    }).appendTo(this);

                                                    $('<label/>', {
                                                        html: function () {
                                                            $('<input/>', {
                                                                name: 'leg_stock_' + i,
                                                                calss: 'position_leg_stock',
                                                                'data-index': i,
                                                                type: 'radio',
                                                                value: 'banknifty'
                                                            }).appendTo(this);

                                                            $('<div/>', {
                                                                html: 'BN'
                                                            }).appendTo(this);
                                                        }
                                                    }).appendTo(this);

                                                }
                                            }).appendTo(this);

                                            $('<div/>', {
                                                title: 'Click to change',
                                                class: 'position__button __expiry__type__button',
                                                'data-index': i,
                                                'data-name': 'expiryType',
                                                html: positionObj.expiryType
                                            }).appendTo(this);
                                        }
                                    }).appendTo(this);
                                }
                            }).appendTo(this);
                        }
                    }).appendTo(this);

                    $("<div/>", {
                        class: 'col',
                        html: function () {
                            $("<div/>", {
                                class: '__position__action',
                                html: function () {
                                    $("<a/>", {
                                        class: 'fa fa-clone position_copy',
                                        'data-index': i
                                    }).appendTo(this);
                                }
                            }).appendTo(this);

                            $("<div/>", {
                                class: '__position__action',
                                html: function () {
                                    $("<a/>", {
                                        class: 'fa fa-trash position_delete',
                                        'data-index': i
                                    }).appendTo(this);
                                }
                            }).appendTo(this);
                        }
                    }).appendTo(this);
                }
            }).appendTo('.__position__box__container');
        }

        function editPosition(e) {
            selectedPosition = allPositions[e];
        }

        function updateLot(e, n) {
            (allPositions[e].totalLot = +allPositions[e].totalLot + n),
                (allPositions[e].totalLot = allPositions[e].totalLot || 1);
            return allPositions[e].totalLot;
        }

        function updateStrikePrice(e, n) {
            var r = allPositions[e],
                a = strikePrice[r.stock],
                i = a.indexOf(+r.strikePrice) + n;
            i < a.length && i >= 0 && (r.strikePrice = a[i].toString());
            return r.strikePrice;
        }

        function updateClosestPremium(e, n) {
            var r = allPositions[e],
                a = closestPremium[r.stock],
                i = a.indexOf(+r.closestPremium) + n;
            i < a.length && i >= 0 && (r.closestPremium = a[i].toString());
            return r.closestPremium;
        }

        function removePosition(e) {
            allPositions.splice(e, 1);
        }

        function copyPosition(e) {
            var r = allPositions[e];
            allPositions.push(JSON.parse(JSON.stringify(r)))
        }

        function toggleActionType(e) {
            allPositions[e].actionType = actionTypeItem[0] == allPositions[e].actionType ? actionTypeItem[1] : actionTypeItem[0];
            return allPositions[e].actionType;
        }

        function toggleOptionType(e) {
            allPositions[e].optionType = optionTypeItem[0] == allPositions[e].optionType ? optionTypeItem[1] : optionTypeItem[0];
            return allPositions[e].optionType;
        }

        function toggleExpiryType(e) {
            allPositions[e].expiryType = expiryTypeItem[0] == allPositions[e].expiryType ? expiryTypeItem[1] : expiryTypeItem[0];
            return allPositions[e].expiryType;
        }

        function toggleStock(e, n) {
            allPositions[e].stock = n;
        }

        function AddNewevents() {

            $(document).off('click').on('click', '.rowarrow', function () {
                var $parent = $(this).parent().parent();
                var name = $parent.data('name');
                var spId = $parent.data('val');
                var index = parseInt($parent.data('index'));

                switch (name) {
                    case 'totalLot':
                        var newVal = updateLot(index, $(this).hasClass('__up__arrow') ? 1 : -1);
                        $parent.find('.' + spId).text(newVal);
                        break;

                    case 'strikePrice':
                        var newVal = updateStrikePrice(index, $(this).hasClass('__up__arrow') ? 1 : -1);
                        $parent.find('.' + spId).text((newVal < 0 ? `ATM${newVal}` : newVal > 0 ? `ATM+${newVal}` : `ATM`));
                        break;

                    case 'closestPremium':
                        var newVal = updateClosestPremium(index, $(this).hasClass('__up__arrow') ? 1 : -1);
                        $parent.find('.' + spId).text(`~${newVal} pt`);
                        break;
                }


            });

            $(document).on('click', '.position__button', function () {

                var $parent = $(this);
                switch ($parent.data('name')) {
                    case 'actionType':
                        var newVal = toggleActionType(parseInt($parent.data('index')));
                        $parent.html(newVal);
                        break;

                    case 'optionType':
                        var newVal = toggleOptionType(parseInt($parent.data('index')));
                        $parent.html(newVal);
                        break;

                    case 'expiryType':
                        var newVal = toggleExpiryType(parseInt($parent.data('index')));
                        $parent.html(newVal);
                        break;
                }

            });

            $(document).on('click', '.position_copy', function () {
                var index = $(this).data('index');
                copyPosition(index);
                $('.__position__box__container').empty();
                addPosition();
            });

            $(document).on('click', '.position_delete', function () {
                var index = $(this).data('index');
                removePosition(index);
                $('.__position__box__container').empty();
                addPosition();
            });

            $(document).on('click', '.addinput', function () {
                var index = $(this).data('index');
                var name = $(this).data('name');
                var $parent = $(this).parent();
                $(this).remove();
                switch (name) {
                    case 'stoploss':
                        addStopLoss($parent, name, index);
                        break;
                    case 'targetprofit':
                        addTargetProfit($parent, name, index);
                        break;
                    case 'trailstoploss':
                        addTrailStopLoss($parent, name, index);
                        break;
                }

            });

            $(document).on('click', '.removeinput', function () {
                var index = $(this).data('index');
                var name = $(this).data('name');
                var $parent = $(this).parent().parent();
                $parent.empty();
                switch (name) {
                    case 'stoploss':
                        removeStopLoss($parent, name, index);
                        break;
                    case 'targetprofit':
                        removeTargetProfit($parent, name, index);
                        break;
                    case 'trailstoploss':
                        removeTrailStopLoss($parent, name, index);
                        break;
                }

            });

            $(document).on('change', '.targetProfitselect', function () {
                var index = $(this).data('index');
                var name = $(this).data('name');
                var val = $(this).val();
                if (name == 'targetprofit')
                    allPositions[index].targetProfit.type = val;
                else
                    allPositions[index].stopLoss.type = val;
            });

            $(document).on('change', '.targetProfitinput', function () {
                var index = $(this).data('index');
                var name = $(this).data('name');
                var val = $(this).val();
                if (name == 'targetprofit')
                    allPositions[index].targetProfit.value = val;
                else
                    allPositions[index].stopLoss.value = val;
            });

        }

        function dynamicRadioChange(i) {
            $(document).on('change', `input[name=leg_stock_${i}]`, function () {
                var index = $(this).data('index');
                var selectedVal = $(this).val();
                toggleStock(index, selectedVal);
            });
        }

        function addTargetProfit($parent, name, index) {
            allPositions[index].targetProfit.status = true;
            var e = allPositions[index].targetProfit;

            $('<div/>', {
                class: '__box__input select__box__input',
                html: function () {
                    $('<select/>', {
                        'class': 'targetProfitselect',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<option/>', {
                                value: 'tpp',
                                text: 'TP %',
                                selected: e.type == 'tpp'
                            }).appendTo(this);

                            $('<option/>', {
                                value: 'tppn',
                                text: 'TP pt',
                                selected: e.type == 'tppn'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));

                    $('<input/>', {
                        'class': '__box__input targetProfitinput',
                        'data-name': name,
                        'data-index': index,
                        type: 'number',
                        placeholder: '0',
                        value: e.value

                    }).appendTo($(this));
                }
            }).appendTo($parent);
            $('<div/>', {
                class: '__close__icon',
                html: function () {
                    $('<label/>', {
                        class: 'checkbox-container removeinput',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<input/>', {
                                type: 'checkbox',
                                value: true
                            });
                            $('<span>', {
                                class: 'fa fa-close fa__remove'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));
                }
            }).appendTo($parent);
        }

        function removeTargetProfit($parent, name, index) {
            allPositions[index].targetProfit.status = false;
            $('<label/>', {
                class: 'checkbox-container addinput',
                'data-name': name,
                'data-index': index,
                html: function () {
                    $('<div/>', {
                        class: 'checkbox-label',
                        html: function () {
                            $('<input/>', {
                                type: 'checkbox',
                                value: false
                            }).appendTo(this);
                            $('<span/>', {
                                class: 'fa fa-plus fa__add'
                            }).appendTo(this);
                        }

                    }).appendTo(this);

                    $('<div/>', {
                        class: 'checkbox__title',
                        html: 'Target Profit'

                    }).appendTo(this);
                }
            }).appendTo($parent);
        }

        function addStopLoss($parent, name, index) {

            allPositions[index].stopLoss.status = true;
            var e = allPositions[index].stopLoss;

            $('<div/>', {
                class: '__box__input select__box__input large__select',
                html: function () {
                    $('<select/>', {
                        'class': 'targetProfitselect',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<option/>', {
                                value: 'slp',
                                text: 'SL %',
                                selected: e.type == 'slp'
                            }).appendTo(this);

                            $('<option/>', {
                                value: 'slpn',
                                text: 'SL pt',
                                selected: e.type == 'slpn'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));

                    $('<input/>', {
                        'class': '__box__input targetProfitinput',
                        'data-name': name,
                        'data-index': index,
                        type: 'number',
                        placeholder: '0',
                        value: e.value
                    }).appendTo($(this));
                }
            }).appendTo($parent);
            $('<div/>', {
                class: '__close__icon',
                html: function () {
                    $('<label/>', {
                        class: 'checkbox-container removeinput',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<input/>', {
                                type: 'checkbox',
                                value: true
                            });
                            $('<span>', {
                                class: 'fa fa-close fa__remove'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));
                }
            }).appendTo($parent);
        }

        function removeStopLoss($parent, name, index) {
            allPositions[index].stopLoss.status = true;
            $('<label/>', {
                class: 'checkbox-container addinput',
                'data-name': name,
                'data-index': index,
                html: function () {
                    $('<div/>', {
                        class: 'checkbox-label',
                        html: function () {
                            $('<input/>', {
                                type: 'checkbox',
                                value: false
                            }).appendTo(this);
                            $('<span/>', {
                                class: 'fa fa-plus fa__add'
                            }).appendTo(this);
                        }

                    }).appendTo(this);

                    $('<div/>', {
                        class: 'checkbox__title',
                        html: 'Stop Loss'

                    }).appendTo(this);
                }
            }).appendTo($parent);
        }

        function addTrailStopLoss($parent, name, index) {
            $('<div/>', {
                class: '__box__input select__box__doubleinput',
                html: function () {
                    $('<select/>', {
                        html: function () {
                            $('<option/>', {
                                value: 'tslp',
                                text: 'TSL %'
                            }).appendTo(this);

                            $('<option/>', {
                                value: 'tslpn',
                                text: 'TSL pt'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));

                    $('<input/>', {
                        type: 'number',
                        placeholder: 'X',
                        class: '__box__input'
                    }).appendTo($(this));

                    $('<input/>', {
                        type: 'number',
                        placeholder: 'Y',
                        class: '__box__input'
                    }).appendTo($(this));
                }
            }).appendTo($parent);

            $('<div/>', {
                class: '__close__icon',
                html: function () {
                    $('<label/>', {
                        class: 'checkbox-container removeinput',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<input/>', {
                                type: 'checkbox',
                                value: true
                            });
                            $('<span>', {
                                class: 'fa fa-close fa__remove'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));
                }
            }).appendTo($parent);
        }

        function removeTrailStopLoss($parent, name, index) {
            $('<label/>', {
                class: 'checkbox-container addinput',
                'data-name': name,
                'data-index': index,
                html: function () {
                    $('<div/>', {
                        class: 'checkbox-label',
                        html: function () {
                            $('<input/>', {
                                type: 'checkbox',
                                value: false
                            }).appendTo(this);
                            $('<span/>', {
                                class: 'fa fa-plus fa__add'
                            }).appendTo(this);
                        }

                    }).appendTo(this);

                    $('<div/>', {
                        class: 'checkbox__title',
                        html: 'Stop Loss'

                    }).appendTo(this);
                }
            }).appendTo($parent);
        }

        $this.init = function () {
            BindData();
            BindPositionItems();
            initilizeModel();
        }
    }

    $(function () {
        var self = new StockMock();
        self.init();
    })
})(jQuery)