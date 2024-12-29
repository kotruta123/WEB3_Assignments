"use strict";
// src/Card.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Points = exports.Value = exports.Color = void 0;
/**
 * The colors of the cards: we keep 'wild' as a color for
 * the Wild and Wild Draw Four (and any custom wild variants).
 */
var Color;
(function (Color) {
    Color["Red"] = "red";
    Color["Green"] = "green";
    Color["Blue"] = "blue";
    Color["Yellow"] = "yellow";
    Color["Wild"] = "wild";
})(Color || (exports.Color = Color = {}));
/**
 * The possible values of UNO cards. We also keep the textual
 * versions for special cards:
 *
 *   - Digits: "0" through "9"
 *   - +2, skip, reverse
 *   - wild, +4 (wild draw four)
 *
 * In the original assignment, this was an enum. We keep it
 * as an enum for consistency.
 */
var Value;
(function (Value) {
    Value["Zero"] = "0";
    Value["One"] = "1";
    Value["Two"] = "2";
    Value["Three"] = "3";
    Value["Four"] = "4";
    Value["Five"] = "5";
    Value["Six"] = "6";
    Value["Seven"] = "7";
    Value["Eight"] = "8";
    Value["Nine"] = "9";
    Value["DrawTwo"] = "+2";
    Value["Skip"] = "skip";
    Value["Reverse"] = "reverse";
    Value["Wild"] = "wild";
    Value["WildDrawFour"] = "+4";
})(Value || (exports.Value = Value = {}));
/**
 * The point values for the various card types, used for scoring
 * after a hand is won.
 */
var Points;
(function (Points) {
    Points[Points["Zero"] = 0] = "Zero";
    Points[Points["One"] = 1] = "One";
    Points[Points["Two"] = 2] = "Two";
    Points[Points["Three"] = 3] = "Three";
    Points[Points["Four"] = 4] = "Four";
    Points[Points["Five"] = 5] = "Five";
    Points[Points["Six"] = 6] = "Six";
    Points[Points["Seven"] = 7] = "Seven";
    Points[Points["Eight"] = 8] = "Eight";
    Points[Points["Nine"] = 9] = "Nine";
    Points[Points["DrawTwo"] = 20] = "DrawTwo";
    Points[Points["Skip"] = 20] = "Skip";
    Points[Points["Reverse"] = 20] = "Reverse";
    Points[Points["Wild"] = 50] = "Wild";
    Points[Points["WildDrawFour"] = 50] = "WildDrawFour";
})(Points || (exports.Points = Points = {}));
/**
 * A Card object. We keep the same name "Card" from Assignment 1.
 */
class Card {
    constructor(color, value, points) {
        this.color = color;
        this.value = value;
        this.points = points;
    }
}
exports.Card = Card;
