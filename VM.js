"use strict";

window.onload = function()
{
    /*
    offset = 2 bits
    vm size = 2048
    physical page = 128
    tlb = 10


    Offset = 2 bits
    Instruction Length = log2(2048) = 11 bits
    Physical Page Rows = 128 / 2^ 2 = 32 rows
    Page Table Rows = 2048 / 2^2 = 512 rows
    TLB Rows= 10 rows
    */

    let PhysicalSize = document.getElementById("pps");
    let OffsetBits = document.getElementById("ofb");
    let VirtualMemory = document.getElementById("vms");
    let TLB = document.getElementById("tlb");

    let reset = document.getElementById("reset");
    let submit = document.getElementById("submit");

    var table = document.getElementById("myTable");
    var TLBtable = document.getElementById("TLBTable");
    var PagingTable = document.getElementById("myTable");
    //var Instruction breakdown = document.getElementById("myTable");

    submit.onclick = function createTable(){
        console.log("clicked");
        console.log(TLB.value);
        var row = 0;
        for (var i = parseInt(TLB.value) -1; i>=0;i--)
        {
            var row = TLBtable.insertRow(row);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = i;
            row++;
        }

        var row = 0;

    }
}
