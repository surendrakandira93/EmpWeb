(function ($) {
    function StockMock() {
        var $this = this;

        var positionItems,
            stockIte,
            segmentItem,
            optionTypeItem,
            actionTypeItem,
            expiryTypeItem,
            selectedPosition,
            allPositions = [],
            strikePrice,
            closestPremium,
            targetProfitTypeItem,
            stopLossTypeItem,
            trailingStopLossTypeItem,
            entryWaitTypeItem,
            lotSize,
            stockInShort,
            squareOffItems,
            squareOff,
            isWaitAndTrade,
            isCTC,
            isReEntry,
            entryTime,
            exitTime,
            minHour,
            minMinute,
            maxHour,
            maxMinute,
            selectedTrb,
            selectedStrategy,
            shownResultStrategy,
            selectedStrategyStatus,
            selectedEntryTime,
            selectedEntryEndTime,
            selectedExitTime,
            entryExitDayType,
            entryDay,
            exitDay,
            allPositionsLengthLimit,
            resStrategiesResult,
            strategiesResult,
            combinedResult,
            isTRB = !1,
            useFuturesAsBase = !1,
            selectedFromDate = new Date("2017-01-01"),
            selectedToDate = new Date(),
            selectedFromDateNode = "",
            selectedToDateNode = "",
            defaultFromDate = new Date("2017-01-01"),
            defaultNiftyFromDate = new Date("2019-02-15"),
            defaultFinNiftyFromDate = new Date("2021-01-11"),
            defaulToDate = new Date(),
            getOnlyWeekData = !0,
            isAddStopLoss = !1,
            stopLossPrice = "",
            stopLossPerLegType = "percent",
            stopLossMTMPrice = "",
            stopLossMTMType = "amount",
            isAddTargetProfit = !1,
            targetProfitPrice = "",
            targetProfitPerLegType = "percent",
            targetProfitMTMPrice = "",
            targetProfitMTMType = "amount",
            isAddTrailingTargetProfit = !1,
            trailTriggerPrice = 1e3,
            trailFirstFixedProfit = 0,
            trailMTMX = 1e3,
            trailMTMY = 500,
            squareOff = "leg",
            allDonations = [],
            donationAmmount = "",
            isPaymentProceed = !1,
            payemntStatus = !1,
            heartBeatsSortBy = [],
            heartBeatsSortByOrder = ["increase", "decrease"],
            selectedHeartBeatsSortBy = "avgDayProfit",
            selectedHeartBeatsSortByOrder = "decrease",
            heartBeatsResults = [],
            heartBeatsStateType = "latest",
            ignoredDates = {},
            isRollover = !1,
            isShowEventDayOfferPopup = !1,
            isEventDaysStrategy = !1,
            isBudgetDaysStrategy = !1,
            maxReEntryValue = "";




        function initilizeModel() {




            onChangeinput("entryType");

            $("#add_position").on('click', function () {
                allPositions.push(JSON.parse(JSON.stringify(selectedPosition)));

                if (allPositions.length == 1)
                    addPositionHeader();

                addPosition();
                $('.__position__footer').show();
            });

            $(".sharestrategy").on('click', function () {
                var url = window.location.origin + "/stockmock/share?qry=" + encodeURI(shareURL());
                url = window.location.origin + "/stockmock/share?" + encodeURI(N());
                //alert(url);
                openShareURL(url);
            })

            var urlArr = window.location.href.split('?');
            if (urlArr.length > 1) {

                var querystr = getUrlVars();
                A1(querystr);
                addPositionHeader();
            }

            //if (qry != '')
            //    A(qry);

            if (allPositions.length > 0) {
                addPosition();
                $('.__position__footer').show();
            }
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

            isWaitAndTrade = !1;
            isCTC = !1;
            isReEntry = !1;
            selectedTrb = { h: "09", m: "31" };
            selectedStrategy = "intraday";
            shownResultStrategy = "intraday";
            selectedStrategyStatus = "t";
            selectedEntryTime = { h: 9, m: 30 };
            selectedEntryEndTime = { h: 10, m: 30 };
            selectedExitTime = { h: 14, m: 30 };
            entryExitDayType = "weekly";
            entryDay = 1;
            exitDay = 0;
            allPositionsLengthLimit = 10;


            lotSize = { nifty: 75, banknifty: 20, finnifty: 40 };
            stockInShort = { nifty: "N", banknifty: "BN", finnifty: "FN", N: "nifty", BN: "banknifty", FN: "finnifty" };
            squareOffItems = ['leg', 'all'];
            squareOff = squareOffItems[0];
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

            entryTime = {
                h: [9, 10, 11, 12, 13, 14, 15],
                m: Array.from({ length: 60 }, function (t, e) {
                    return e.toString().padStart(2, "0");
                }),
            };
            exitTime = {
                h: [9, 10, 11, 12, 13, 14, 15],
                m: Array.from({ length: 60 }, function (t, e) {
                    return e.toString().padStart(2, "0");
                }),
            };
            minHour = 9;
            minMinute = 16;
            maxHour = 15;
            maxMinute = 29;

            stockItem = ['nifty', 'banknifty'];
            segmentItem = ['futures', 'options'];
            optionTypeItem = ['call', 'put'];
            actionTypeItem = ['buy', 'sell'];
            expiryTypeItem = ['weekly', 'monthly'];
            targetProfitTypeItem = [{ value: 'tpp', text: 'TP %' }, { value: 'tppn', text: 'TP pt' }];
            stopLossTypeItem = [{ value: 'slp', text: 'SL %' }, { value: 'slpn', text: 'SL pt' }];
            trailingStopLossTypeItem = [{ value: 'tslp', text: 'TSL %' }, { value: 'tslpn', text: 'TSL pt' }];
            entryWaitTypeItem = [{ value: 'wp_+', text: '🧭  % ↑' }, { value: 'wp_-', text: '🧭  % ↓' }, { value: 'wpn_+', text: '🧭  pt ↑' }, { value: 'wpn_-', text: '🧭  pt ↓' }];

            selectedPosition = {
                entryType: "atm",
                isChecked: !0,
                stock: stockItem[1],
                segment: segmentItem[0],
                optionType: optionTypeItem[0],
                actionType: actionTypeItem[0],
                strikePrice: 0,
                closestPremium: 25,
                totalLot: 1,
                expiryType: expiryTypeItem[0],
                premiumRange: [100, 200],
                isWaitAndTrade: !1,
                targetProfit: { status: !1, type: targetProfitTypeItem[0].value, value: "" },
                stopLoss: { status: !1, type: stopLossTypeItem[0].value, value: "" },
                trailingStopLoss: { status: !1, xValue: '', yValue: '', type: trailingStopLossTypeItem[0].value },
                entryWait: { type: entryWaitTypeItem[0].value, value: '' },
                trb: { h: "", m: "" },
                reEntry: { status: !1, value: 1 },
            };

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

        function addPositionHeader() {
            $('#header_header').empty();

            $('<div/>', {
                class: 'squar__off__type',
                html: function () {

                    $('<div/>', {
                        html: function () {
                            $('<label/>', {
                                'class': 'checkbox-container',
                                html: function () {
                                    $('<div/>', {
                                        class: 'checkbox-label',
                                        html: function () {
                                            $('<input/>', {
                                                type: 'radio',
                                                name: 'squareOff',
                                                value: 'leg',
                                                checked: squareOff == 'leg'
                                            }).appendTo(this)
                                            $('<span/>', {
                                                class: 'checkbox-custom radio__type'
                                            }).appendTo(this);
                                        }
                                    }).appendTo(this);

                                    $('<div/>', {
                                        class: 'checkbox__title',
                                        html: 'Square Off One Leg'
                                    }).appendTo(this);
                                }
                            }).appendTo(this);

                            $('<label/>', {
                                'class': 'checkbox-container',
                                html: function () {
                                    $('<div/>', {
                                        class: 'checkbox-label',
                                        html: function () {
                                            $('<input/>', {
                                                type: 'radio',
                                                name: 'squareOff',
                                                value: 'all',
                                                checked: squareOff == 'all'
                                            }).appendTo(this)
                                            $('<span/>', {
                                                class: 'checkbox-custom radio__type'
                                            }).appendTo(this)
                                        }
                                    }).appendTo(this);

                                    $('<div/>', {
                                        class: 'checkbox__title',
                                        html: 'Square Off All Legs'
                                    }).appendTo(this);
                                }
                            }).appendTo(this);
                        }
                    }).appendTo(this);


                }
            }).appendTo('#header_header');

            $('<div/>', {
                class: 'squar__off__type entry_condition',
                html: function () {
                    $('<div/>', {
                        html: function () {
                            $('<label/>', {
                                'class': 'checkbox-container',
                                html: function () {
                                    $('<div/>', {
                                        class: 'checkbox-label',
                                        html: function () {
                                            $('<input/>', {
                                                type: 'checkbox',
                                                name: 'isWaitAndTrade',
                                                checked: isWaitAndTrade
                                            }).appendTo(this)
                                            $('<span/>', {
                                                class: 'checkbox-custom'
                                            }).appendTo(this)
                                        }
                                    }).appendTo(this);

                                    $('<div/>', {
                                        class: 'checkbox__title',
                                        html: 'Wait & Trade'
                                    }).appendTo(this);
                                }
                            }).appendTo(this);

                            $('<label/>', {
                                'class': 'checkbox-container',
                                html: function () {
                                    $('<div/>', {
                                        class: 'checkbox-label',
                                        html: function () {
                                            $('<input/>', {
                                                type: 'checkbox',
                                                name: 'isCTC',
                                                checked: isCTC
                                            }).appendTo(this)
                                            $('<span/>', {
                                                class: 'checkbox-custom'
                                            }).appendTo(this)
                                        }
                                    }).appendTo(this);

                                    $('<div/>', {
                                        class: 'checkbox__title',
                                        html: 'Move SL to Cost'
                                    }).appendTo(this);
                                }
                            }).appendTo(this);

                            $('<label/>', {
                                'class': 'checkbox-container',
                                html: function () {
                                    $('<div/>', {
                                        class: 'checkbox-label',
                                        html: function () {
                                            $('<input/>', {
                                                type: 'checkbox',
                                                name: 'isReEntry',
                                                checked: isReEntry
                                            }).appendTo(this)
                                            $('<span/>', {
                                                class: 'checkbox-custom'
                                            }).appendTo(this);
                                        }
                                    }).appendTo(this);

                                    $('<div/>', {
                                        class: 'checkbox__title',
                                        html: 'Re-Entry'
                                    }).appendTo(this);
                                }
                            }).appendTo(this);
                        }
                    }).appendTo(this);


                }
            }).appendTo('#header_header');
        }

        function addPosition() {
            $('#header_row').empty();

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
                                                value: positionObj.isChecked,
                                                class: 'poss_check',
                                                'data-index': i,
                                                checked: positionObj.isChecked
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

                                            if (isWaitAndTrade) {
                                                $('<div/>', {
                                                    'class': '__box__input select__box__input large__select',
                                                    html: function () {
                                                        $('<select/>', {
                                                            class: 'targetProfitselect',
                                                            'data-name': 'entryWait',
                                                            'data-index': i,
                                                            html: function () {
                                                                for (var i = 0; i < entryWaitTypeItem.length; i++) {
                                                                    var wItem = entryWaitTypeItem[i];
                                                                    $('<option/>', {
                                                                        value: wItem.value,
                                                                        text: wItem.text,
                                                                        selected: positionObj.entryWait.type == wItem.value
                                                                    }).appendTo(this);
                                                                }
                                                            }
                                                        }).appendTo(this);

                                                        $('<input/>', {
                                                            type: 'number',
                                                            'placeholder': '0',
                                                            class: '__box__input targetProfitinput',
                                                            'data-name': 'entryWait',
                                                            'data-index': i,
                                                            value: positionObj.entryWait.value
                                                        }).appendTo(this);

                                                    }
                                                }).appendTo(this);
                                            }

                                            $("<div/>", {
                                                class: 'add__leg__tpsl',
                                                html: function () {
                                                    if (positionObj.targetProfit.status) {
                                                        addTargetProfit(this, 'targetprofit', i);
                                                    } else {
                                                        removeTargetProfit(this, 'targetprofit', i);
                                                    }
                                                }
                                            }).appendTo(this);

                                            $("<div/>", {
                                                class: 'add__leg__tpsl',
                                                html: function () {
                                                    if (positionObj.stopLoss.status) {
                                                        addStopLoss(this, 'stoploss', i);
                                                    } else {
                                                        removeStopLoss(this, 'stoploss', i);
                                                    }
                                                }
                                            }).appendTo(this);

                                            $("<div/>", {
                                                class: 'add__leg__tpsl trailing__box',
                                                html: function () {
                                                    if (!isReEntry) {
                                                        if (positionObj.trailingStopLoss.status) {
                                                            addTrailStopLoss(this, 'trailstoploss', i);
                                                        } else {
                                                            removeTrailStopLoss(this, 'trailstoploss', i);
                                                        }
                                                    } else {
                                                        if (positionObj.reEntry.status) {
                                                            addReEntry(this, 'reEntry', i);
                                                        } else {
                                                            removeReEntry(this, 'reEntry', i)
                                                        }
                                                    }
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
            }).appendTo('#header_row');


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
                    case 'reEntry':
                        addReEntry($parent, name, index);
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
                    case 'reEntry':
                        removeReEntry($parent, name, index);
                        break;
                }

            });

            $(document).on('change', '.targetProfitselect', function () {
                var index = $(this).data('index');
                var name = $(this).data('name');
                var val = $(this).val();
                if (name == 'targetprofit')
                    allPositions[index].targetProfit.type = val;
                else if (name == 'trailstoploss')
                    allPositions[index].trailingStopLoss.type = val;
                else if (name == 'entryWait')
                    allPositions[index].entryWait.type = val;
                else if (name == 'reEntry')
                    allPositions[index].reEntry.value = parseInt(val);
                else
                    allPositions[index].stopLoss.type = val;
            });

            $(document).on('change', '.targetProfitinput', function () {
                var index = $(this).data('index');
                var name = $(this).data('name');
                var val = $(this).val();
                if (name == 'targetprofit')
                    allPositions[index].targetProfit.value = val;
                else if (name == 'trailstoploss') {
                    if ($(this).hasClass('x'))
                        allPositions[index].trailingStopLoss.xValue = val;
                    else
                        allPositions[index].trailingStopLoss.yValue = val;
                }
                else if (name == 'entryWait')
                    allPositions[index].entryWait.value = val;
                else
                    allPositions[index].stopLoss.value = val;
            });

            $(document).on('click', '.closepop', function () {
                $('.share__modal').remove();
            });

            $(document).on("success", ".__copy__button", function (t) {
                document.getElementById("referrLink") && document.getElementById("referrLink").focus()
            })

            $(document).on('click', '.poss_check', function () {

                $(this).val($(this).is(':checked'));
                var index = parseInt($(this).data('index'));
                allPositions[index].isChecked = $(this).is(':checked');
                if ($(this).is(':checked')) {
                    $('#po_row_' + index).find('.__position__details').removeClass('__inactive');
                } else {
                    $('#po_row_' + index).find('.__position__details').addClass('__inactive');
                }

            });

            $(document).on('change', 'input[name=isWaitAndTrade]', function () {
                isWaitAndTrade = $(this).is(':checked');
                addPosition();
            });

            $(document).on('change', 'input[name=isCTC]', function () {
                isCTC = $(this).is(':checked');
                isReEntry = false;
                $('input[name=isReEntry]').prop("checked", false);
                addPosition();
            });

            $(document).on('change', 'input[name=isReEntry]', function () {
                isReEntry = $(this).is(':checked');
                isCTC = false
                $('input[name=isCTC]').prop("checked", false);
                addPosition();
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
            allPositions[index].stopLoss.status = false;
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

            allPositions[index].trailingStopLoss.status = true;
            var e = allPositions[index].trailingStopLoss;

            $('<div/>', {
                class: '__box__input select__box__doubleinput',
                html: function () {
                    $('<select/>', {
                        'class': 'targetProfitselect',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<option/>', {
                                value: 'tslp',
                                text: 'TSL %',
                                selected: e.type == 'tslp'
                            }).appendTo(this);

                            $('<option/>', {
                                value: 'tslpn',
                                text: 'TSL pt',
                                selected: e.type == 'tslpn'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));

                    $('<input/>', {
                        'class': '__box__input targetProfitinput x',
                        'data-name': name,
                        'data-index': index,
                        type: 'number',
                        placeholder: 'X',
                        value: e.xValue
                    }).appendTo($(this));

                    $('<input/>', {
                        'class': '__box__input targetProfitinput y',
                        'data-name': name,
                        'data-index': index,
                        type: 'number',
                        placeholder: 'Y',
                        value: e.yValue
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
            allPositions[index].trailingStopLoss.status = false;
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
                        html: 'Trail Stop Loss'

                    }).appendTo(this);
                }
            }).appendTo($parent);
        }

        function addReEntry($parent, name, index) {

            allPositions[index].reEntry.status = true;
            var e = allPositions[index].reEntry;

            $('<div/>', {
                class: '__box__input label_group',
                html: function () {
                    $('<div/>', {
                        'class': 'label',
                        html: 'Re-entry'
                    }).appendTo(this);
                    $('<select/>', {
                        'class': 'targetProfitselect',
                        'data-name': name,
                        'data-index': index,
                        html: function () {
                            $('<option/>', {
                                value: '1',
                                text: '1',
                                selected: e.value == 1
                            }).appendTo(this);

                            $('<option/>', {
                                value: '2',
                                text: '2',
                                selected: e.value == 2
                            }).appendTo(this);

                            $('<option/>', {
                                value: '3',
                                text: '3',
                                selected: e.value == 3
                            }).appendTo(this);
                            $('<option/>', {
                                value: '4',
                                text: '4',
                                selected: e.value == 4
                            }).appendTo(this);
                            $('<option/>', {
                                value: '5',
                                text: '5',
                                selected: e.value == 5
                            }).appendTo(this);

                        }
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
                            $('<span>', {
                                class: 'fa fa-close fa__remove'
                            }).appendTo(this);
                        }
                    }).appendTo($(this));
                }
            }).appendTo($parent);
        }

        function removeReEntry($parent, name, index) {
            allPositions[index].trailingStopLoss.status = false;
            $('<label/>', {
                class: 'checkbox-container addinput',
                'data-name': name,
                'data-index': index,
                html: function () {
                    $('<div/>', {
                        class: 'checkbox-label',
                        html: function () {
                            $('<span/>', {
                                class: 'fa fa-plus fa__add'
                            }).appendTo(this);
                        }

                    }).appendTo(this);

                    $('<div/>', {
                        class: 'checkbox__title',
                        html: 'Re-entry'

                    }).appendTo(this);
                }
            }).appendTo($parent);
        }

        function shareURL() {
            return (
                allPositions
                    //.filter(function (t) {
                    //    return t.isChecked;
                    //})
                    .map(function (e) {
                        var n = "";
                        //n = [
                        //    e.totalLot * lotSize[e.stock],
                        //    "sell" == e.actionType ? "S" : "B",
                        //    ("futures" == e.segment ? ('F::') : 'P:' + (e.strikePrice).toString() + ':' + ("call" == e.optionType ? "CE" : "PE")),
                        //    "".concat("weekly" == e.expiryType ? "CW" : "CM"),
                        //    "".concat(stockInShort[e.stock]),
                        //    (e.stopLoss.status && ("slcl" == e.stopLoss.type || e.stopLoss.value) ? "".concat(e.stopLoss.type, "_").concat("slcl" == e.stopLoss.type ? "1" : e.stopLoss.value).toUpperCase() : "null"),
                        //    (e.targetProfit.status && e.targetProfit.value ? "".concat(e.targetProfit.type, "_").concat(e.targetProfit.value).toUpperCase() : "null"),
                        //    (e.trailingStopLoss.status && e.trailingStopLoss.xValue && e.trailingStopLoss.yValue
                        //        ? "".concat(e.trailingStopLoss.type, "_").concat(e.trailingStopLoss.xValue, "_").concat(e.trailingStopLoss.yValue).toUpperCase() : "null"),
                        //    "".concat(e.entryType)
                        //].join(":");
                        //debugger;
                        return (
                            n = [
                                e.totalLot * lotSize[e.stock],
                                "sell" == e.actionType ? "S" : "B",
                                ("futures" == e.segment ? ('F::') : 'P:' + ((e.entryType == 'atm' ? e.strikePrice : e.closestPremium) + ':' + ("call" == e.optionType ? "CE" : "PE"))),
                                "".concat("weekly" == e.expiryType ? "CW" : "CM"),
                                "".concat(stockInShort[e.stock]),
                                (e.stopLoss.status && ("slcl" == e.stopLoss.type || e.stopLoss.value) ? "".concat(e.stopLoss.type, "_").concat("slcl" == e.stopLoss.type ? "1" : e.stopLoss.value).toUpperCase() : "null"),
                                (e.targetProfit.status && e.targetProfit.value ? "".concat(e.targetProfit.type, "_").concat(e.targetProfit.value).toUpperCase() : "null"),
                                (e.trailingStopLoss.status && e.trailingStopLoss.xValue && e.trailingStopLoss.yValue ? "".concat(e.trailingStopLoss.type, "_").concat(e.trailingStopLoss.xValue, "_").concat(e.trailingStopLoss.yValue).toUpperCase() : "null"),
                                "".concat(e.entryType)
                            ].join(":")
                        )
                    }).toString()
            )

        }

        function N(e) {
            var n =
                "p=".concat(L()) +
                "&et=".concat(selectedEntryTime.h, ":").concat(selectedEntryTime.m, ":00,").concat(selectedExitTime.h, ":").concat(selectedExitTime.m, ":00") +
                "&s=".concat(selectedStrategy).concat("expiry" == selectedStrategy ? "_".concat(entryExitDayType) : "") +
                (e ? "" : "&ed=".concat(entryDay, ",").concat(exitDay)) +
                (e ? "" : "&sfd=".concat(+selectedFromDate)) +
                (e ? "" : "&std=".concat(+selectedToDate));
            if (isAddStopLoss && stopLossMTMPrice) {
                var r = "premium" == stopLossMTMType ? "slpm" : "sl";
                n += "&".concat(r, "=").concat(-stopLossMTMPrice);
            }
            if (isAddTargetProfit && targetProfitMTMPrice) {
                var a = "premium" == targetProfitMTMType ? "tpm" : "tp";
                n += "&".concat(a, "=").concat(targetProfitMTMPrice);
            }
            isAddTrailingTargetProfit && (n += "&ttp=".concat([selectedTrailProfitTypeIndex, trailTriggerPrice, trailFirstFixedProfit, trailMTMX, trailMTMY].toString())),
                (n += "&so=".concat(squareOff)),
                "pr" == selectedPosition.entryType && ((n += "&pr=".concat(selectedPosition.premiumRange.toString())), (n += "&ete=".concat(selectedEntryEndTime.h, ":").concat(selectedEntryEndTime.m, ":00"))),
                "intraday" == selectedStrategy && (n += "&rollover=".concat(!!isRollover)),
                isEventDaysStrategy && (n += "&eds=".concat(eventDaysOption[selectedEventIndex].hash)),
                isCTC && (n += "&ctc=".concat(isCTC)),
                isWaitAndTrade && (n += "&wat=".concat(isWaitAndTrade)),
                isTRB && (n += "&trb=".concat(selectedTrb.h, "_").concat(selectedTrb.m)),
                isReEntry && (n += "&re=".concat(maxReEntryValue > 0 ? maxReEntryValue : 0));
            var i = "premium" == selectedPosition.entryType ? "pr" : selectedPosition.entryType;
            return n + "&set=".concat(i);
        }

        function L() {
            return (

                allPositions
                    .filter(function (t) {
                        return t.isChecked;
                    })
                    .map(function (e) {
                        var n = "";
                        return (
                            (n =
                                "futures" == e.segment
                                    ? ["".concat(stockInShort[e.stock], "::F"), "sell" == e.actionType ? "S" : "B", e.totalLot * lotSize[e.stock]].join("_")
                                    : [
                                        "cp" == e.entryType
                                            ? "".concat(stockInShort[e.stock], "::CP") + "".concat(e.closestPremium)
                                            : "".concat(stockInShort[e.stock], "::") + "".concat("atm" == e.entryType ? e.strikePrice : "".concat(selectedPosition.premiumRange.join(";"))),
                                        "sell" == e.actionType ? "S" : "B",
                                        "call" == e.optionType ? "CE" : "PE",
                                        e.totalLot * lotSize[e.stock],
                                    ].join("_")),
                            (n +=
                                e.stopLoss.status && ("slcl" == e.stopLoss.type || e.stopLoss.value)
                                    ? "::"
                                        .concat(e.stopLoss.type, "_")
                                        .concat("slcl" == e.stopLoss.type ? "1" : e.stopLoss.value)
                                        .toUpperCase()
                                    : "::null"),
                            (n += e.targetProfit.status && e.targetProfit.value ? "::".concat(e.targetProfit.type, "_").concat(e.targetProfit.value).toUpperCase() : "::null"),
                            (n += "::".concat("weekly" == e.expiryType ? "CW" : "CM")),
                            (n +=
                                !isReEntry && "intraday" == selectedStrategy && e.stopLoss.status && e.trailingStopLoss.status && e.trailingStopLoss.xValue && e.trailingStopLoss.yValue
                                    ? "::".concat(e.trailingStopLoss.type, "_").concat(e.trailingStopLoss.xValue, "_").concat(e.trailingStopLoss.yValue).toUpperCase()
                                    : "::null"),
                            (n +=
                                isWaitAndTrade && e.entryWait.value
                                    ? "::"
                                        .concat(e.entryWait.type, "_")
                                        .concat("-" == e.entryWait.premium ? "-" : "")
                                        .concat(e.entryWait.value)
                                        .toUpperCase()
                                    : "::null"),
                            (n += "::".concat(e.entryType)),
                            (n +=
                                selectedStrategy.includes("intraday") && isTRB && selectedTrb.h && selectedTrb.m
                                    ? "::"
                                        .concat("sell" == e.actionType ? "Lo" : "Hi", "_")
                                        .concat(selectedTrb.h.toString().padStart(2, 0), ":")
                                        .concat(selectedTrb.m.toString().padStart(2, 0), ":00")
                                    : "::null") + (isReEntry && e.reEntry.status && e.reEntry.value > 0 ? "::RE_".concat(e.reEntry.value) : "::null")
                        );
                    })
                    .toString()
            );
        }

        function openShareURL(url) {
            $('<div/>', {
                class: 'container share__modal',
                html: function () {
                    $('<div/>', {
                        class: 'modal show fade',
                        style: "display:block",
                        html: function () {
                            $('<div/>', {
                                class: 'modal-dialog modal-dialog-centered',
                                html: function () {
                                    $('<div/>', {
                                        class: 'modal-content',
                                        html: function () {
                                            $('<div/>', {
                                                class: 'modal-header',
                                                html: function () {
                                                    $('<h4/>', {
                                                        class: 'modal-title',
                                                        text: 'Share This Strategy'
                                                    }).appendTo(this)

                                                    $('<button/>', {
                                                        class: 'close closepop',
                                                        type: "button",
                                                        html: "×"
                                                    }).appendTo(this)
                                                }
                                            }).appendTo(this)

                                            $('<div/>', {
                                                class: 'modal-body',
                                                html: function () {
                                                    $('<input/>', {
                                                        'calss': '__sharelink',
                                                        'id': 'shareLink',
                                                        value: url
                                                    }).appendTo(this)

                                                    $('<div/>', {
                                                        class: '__link',
                                                        html: function () {
                                                            $('<a/>', {
                                                                class: '__copy__button',
                                                                "data-clipboard-target": "#shareLink",
                                                                html: "Click to copy"
                                                            }).appendTo(this)
                                                        }
                                                    }).appendTo(this)
                                                }
                                            }).appendTo(this)

                                            $('<div/>', {
                                                calss: 'modal-footer',
                                                html: function () {
                                                    $('<button/>', {
                                                        class: '__button closepop',
                                                        type: "button",
                                                        html: "Close"
                                                    }).appendTo(this)
                                                }
                                            }).appendTo(this)
                                        }
                                    }).appendTo(this)
                                }
                            }).appendTo(this)
                        }
                    }).appendTo(this)

                    $('<div/>', {
                        class: 'modal-backdrop show'
                    }).appendTo(this)
                }
            }).appendTo('.__page');
            new ClipboardJS('.__copy__button');
        }

        function A(e) {

            var i = e.split(",");

            i.forEach(function (e) {
                var s, seg, opt, act, sp, tl, ent, closestPremium, tagpr, stopl, trstopl, ext
                if (e.indexOf(":") > -1) {
                    var v = dt(e.split(":"), 9);
                    (tl = v[0]),
                        (act = v[1]),
                        (seg = v[2]),
                        (sp = v[3]),
                        (opt = v[4]),
                        (ext = v[5]),
                        (s = v[6]),
                        (stopl = v[7]),
                        (tagpr = v[8]),
                        (trstopl = v[9]),
                        (ent = v[10]),
                        (s = "BN" == s ? "banknifty" : "N" == s ? "nifty" : "finnifty"),
                        (seg = "F" == seg ? "futures" : "options"),
                        (ext = 'CW' == ext ? 'weekly' : 'monthly'),
                        (opt = "CE" == opt ? 'call' : 'sell'),
                        (act = "S" == act ? 'sell' : 'buy');
                }

                d = {
                    stock: s,
                    segment: seg,
                    optionType: opt,
                    actionType: act,
                    strikePrice: sp,
                    totalLot: tl / lotSize[s],
                    closestPremium: sp,
                };

                var x = { status: !1, type: "slp", value: "" };
                if (!x.status) {
                    var P = dt(tagpr.split("_"), 2),
                        T = P[0],
                        D = P[1];
                    if (P.length > 1) {
                        (x.status = !0),
                            (x.type = T.toLowerCase()),
                            (x.value = D);
                    }
                }
                var A = { status: !1, type: "tslp", xValue: "", yValue: "" };
                if (!A.status) {
                    var C = dt(trstopl.split("_"), 3),
                        N = C[0],
                        R = C[1],
                        E = C[2];
                    if (C.length > 1) {
                        (A.status = !0), (A.type = N.toLowerCase()), (A.xValue = R), (A.yValue = E);
                    }
                }
                var M = { status: !1, type: "tpp", value: "" };
                if (!M.status) {
                    var I = dt(stopl.split("_"), 2),
                        O = I[0],
                        B = I[1];
                    if (I.length > 1) {
                        (M.status = !0), (M.type = O.toLowerCase()), (M.value = B);
                    }
                }

                var newselectedPosition = {
                    entryType: ent,
                    stock: d.stock,
                    segment: d.segment,
                    optionType: d.optionType,
                    actionType: d.actionType,
                    strikePrice: d.strikePrice,
                    closestPremium: d.closestPremium,
                    totalLot: d.totalLot,
                    expiryType: ext,
                    premiumRange: [100, 200],
                    isWaitAndTrade: !1,
                    targetProfit: x,
                    stopLoss: M,
                    trailingStopLoss: A,
                    entryWait: { type: 'wp_%_+_↑', value: '' }
                };

                allPositions.push(newselectedPosition);
            });
        }

        function dt(t, e) {
            return (
                (function (t) {
                    if (Array.isArray(t)) return t;
                })(t) ||
                (function (t, e) {
                    var n = null == t ? null : ("undefined" != typeof Symbol && t[Symbol.iterator]) || t["@@iterator"];
                    if (null != n) {
                        var r,
                            a,
                            i = [],
                            o = !0,
                            s = !1;
                        try {
                            for (n = n.call(t); !(o = (r = n.next()).done) && (i.push(r.value), !e || i.length !== e); o = !0);
                        } catch (t) {
                            (s = !0), (a = t);
                        } finally {
                            try {
                                o || null == n.return || n.return();
                            } finally {
                                if (s) throw a;
                            }
                        }
                        return i;
                    }
                })(t, e) ||
                mt(t, e) ||
                (function () {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                })()
            );
        }

        function A1(qry) {


            var i = qry.p.split(",");

            i.forEach(function (e) {
                var s, seg, opt, act, sp, tl, ent, closestPremium, tagpr, stopl, trstopl, ext, waitAndTrade, reentry;
                if (e.indexOf(":") > -1) {
                    var v = dt(e.split(":"), 9);

                    (s = v[0]),
                        (ext = v[8]),
                        (stopl = v[4]),
                        (tagpr = v[6]),
                        (trstopl = v[10]),
                        (waitAndTrade = v[12]),
                        (reentry = v[18]),
                        (s = "BN" == v[0] ? "banknifty" : "N" == s ? "nifty" : "finnifty"),
                        (seg = "F" == v[2] ? "futures" : "options"),
                        (ext = 'CW' == ext ? 'weekly' : 'monthly'),
                        (opt = "CE" == opt ? 'call' : 'sell'),
                        (act = "S" == act ? 'sell' : 'buy');
                }


                if ("F" == v[2].split("_")[0]) {

                    var w = dt(v[2].split("_"), 3);
                    act = "B" == (i = w[1]) ? "buy" : "sell";
                    tl = (l = w[2]) ? l / lotSize[s] : 1;
                    seg = "futures";
                    ent = "atm";
                    (d = { stock: s, segment: "futures", actionType: "B" == (i = w[1]) ? "buy" : "sell", totalLot: (l = w[2]) ? l / lotSize[s] : 1 });
                } else {
                    ent = v[2].split("_")[0].startsWith('CP') ? "cp" : "atm";
                    seg = "options";
                    var S = dt(v[2].split("_"), 5);
                    sp = ent == 'cp' ? S[0].split('CP')[1] : S[0];
                    act = "S" == S[1] ? 'sell' : 'buy';
                    opt = "CE" == S[2] ? "call" : "put";
                    tl = S[3] / lotSize[s];

                }


                d = {
                    stock: s,
                    segment: seg,
                    optionType: opt,
                    actionType: act,
                    strikePrice: sp,
                    totalLot: tl,
                    closestPremium: sp,
                };

                var x = { status: !1, type: "slp", value: "" };
                if (!x.status) {
                    var P = dt(tagpr.split("_"), 2),
                        T = P[0],
                        D = P[1];
                    if (P.length > 1) {
                        (x.status = !0),
                            (x.type = T.toLowerCase()),
                            (x.value = D);
                    }
                }
                var A = { status: !1, type: "tslp", xValue: "", yValue: "" };
                if (!A.status) {
                    var C = dt(trstopl.split("_"), 3),
                        N = C[0],
                        R = C[1],
                        E = C[2];
                    if (C.length > 1) {
                        (A.status = !0), (A.type = N.toLowerCase()), (A.xValue = R), (A.yValue = E);
                    }
                }

                var M = { status: !1, type: "tpp", value: "" };
                if (!M.status) {
                    var I = dt(stopl.split("_"), 2),
                        O = I[0],
                        B = I[1];
                    if (I.length > 1) {
                        (M.status = !0), (M.type = O.toLowerCase()), (M.value = B);
                    }
                }


                var F = { status: isWaitAndTrade, type: "wp", premium: "+", value: "" };
                if (waitAndTrade && "null" != waitAndTrade.toLowerCase()) {
                    isWaitAndTrade = !0;
                    var j = dt(waitAndTrade.split("_"), 3),
                        q = j[0],
                        W = j[1],
                        z = j[2];
                    (F.status = isWaitAndTrade), (F.type = q), (F.premium = W), (F.value = z);
                }

                var U = { status: !1, value: 1 };
                if (reentry && "null" != reentry.toLowerCase()) {
                    U.status = !0;
                    U.value = reentry.split('_')[1];
                    isReEntry = !0;
                }

                var newselectedPosition = {
                    isChecked:!0,
                    entryType: ent,
                    stock: d.stock,
                    segment: d.segment,
                    optionType: d.optionType,
                    actionType: d.actionType,
                    strikePrice: d.strikePrice,
                    closestPremium: d.closestPremium,
                    totalLot: d.totalLot,
                    expiryType: ext,
                    premiumRange: [100, 200],
                    isWaitAndTrade: !1,
                    targetProfit: x,
                    stopLoss: M,
                    trailingStopLoss: A,
                    entryWait: F,
                    trb: { h: "", m: "" },
                    reEntry: U,
                };

                allPositions.push(newselectedPosition);
            });



        }

        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
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