/*
Mohammad Noor Ghafoor Zada
11/10/2025
Fifteen puzzle Project 4 
CS & 248 Bill Mccoy

*/


"use strict";

(function () {

  
    const GRID = 4;
    const TILE_SIZE = 100;    
    const SHUFFLE_COUNT = 1000;

   
    let emptyRow = 3;  
    let emptyCol = 3;

   
    function $(id) {
        return document.getElementById(id);
    }

    function tileId(r, c) {
        return "square_" + r + "_" + c;
    }

    function puzzleArea() {
        return $("puzzlearea");
    }

    function numberFor(r, c) {
        const num = r * GRID + c + 1;
        return num <= 15 ? num : null;
    }

    function getTilePosition(tile) {
        const parts = tile.id.split("_");
        return {
            r: parseInt(parts[1]),
            c: parseInt(parts[2])
        };
    }

    function isNeighbor(r, c) {
        const dr = Math.abs(r - emptyRow);
        const dc = Math.abs(c - emptyCol);
        return dr + dc === 1;
    }

    /* ----- TILE CREATION ----- */
    function createTile(r, c, num) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = tileId(r, c);
        tile.textContent = num;

        // Position
        tile.style.left = (c * TILE_SIZE) + "px";
        tile.style.top = (r * TILE_SIZE) + "px";

        // Background slice (negative shifting)
        const bx = -((num - 1) % GRID) * TILE_SIZE;
        const by = -(Math.floor((num - 1) / GRID)) * TILE_SIZE;
        tile.style.backgroundPosition = bx + "px " + by + "px";

        // Events
        tile.addEventListener("mouseenter", updateMovableClass);
        tile.addEventListener("mouseleave", updateMovableClass);
        tile.addEventListener("click", moveHandler);

        return tile;
    }

    /* ----- MOVEMENT LOGIC ----- */
    function updateMovableClass() {
        const pos = getTilePosition(this);
        if (isNeighbor(pos.r, pos.c)) {
            this.classList.add("movable");
        } else {
            this.classList.remove("movable");
        }
    }

    function moveHandler() {
        const pos = getTilePosition(this);
        if (isNeighbor(pos.r, pos.c)) {
            moveTile(this, pos.r, pos.c);
        }
    }

    function moveTile(tile, fromR, fromC) {
        // Move tile to empty slot visually
        tile.style.left = (emptyCol * TILE_SIZE) + "px";
        tile.style.top = (emptyRow * TILE_SIZE) + "px";

        // Update its ID
        tile.id = tileId(emptyRow, emptyCol);

        // Update empty location
        emptyRow = fromR;
        emptyCol = fromC;

        refreshMovables();
    }

    function refreshMovables() {
        const tiles = puzzleArea().querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.classList.remove("movable");
            const pos = getTilePosition(tile);
            if (isNeighbor(pos.r, pos.c)) {
                tile.classList.add("movable");
            }
        });
    }

    /* ----- SHUFFLING ----- */
    function neighborTiles() {
        const candidates = [
            { r: emptyRow - 1, c: emptyCol },
            { r: emptyRow + 1, c: emptyCol },
            { r: emptyRow, c: emptyCol - 1 },
            { r: emptyRow, c: emptyCol + 1 }
        ];

        const result = [];

        candidates.forEach(pos => {
            const tile = $(tileId(pos.r, pos.c));
            if (tile) {
                result.push({ tile: tile, r: pos.r, c: pos.c });
            }
        });

        return result;
    }

    function shuffleBoard() {
        for (let i = 0; i < SHUFFLE_COUNT; i++) {
            const list = neighborTiles();
            const pick = list[Math.floor(Math.random() * list.length)];
            moveTile(pick.tile, pick.r, pick.c);
        }
        refreshMovables();
    }

 
    function buildBoard() {
        const board = puzzleArea();

        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const num = numberFor(r, c);
                if (num !== null) {
                    board.appendChild(createTile(r, c, num));
                }
            }
        }

        refreshMovables();
    }


    window.onload = function () {
        buildBoard();

        const shuffleBtn = $("shufflebutton");
        shuffleBtn.addEventListener("click", shuffleBoard);
    };

})();
