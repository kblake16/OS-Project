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
    let Offset = document.getElementById("ofb");
    let VM = document.getElementById("vms");
    let TLB = document.getElementById("tlb");

    let reset = document.getElementById("reset");
    let submit = document.getElementById("submit");

    var VMtable = document.getElementById("VirtualMemoryTable");
    var TLBtable = document.getElementById("TLBTable");
    var Pagingtable = document.getElementById("Pagetable");
    var PhysicalMemorytable = document.getElementById("PhysicalMemoryTable");

    submit.onclick = function createTable(){
        console.log("clicked");

        console.log

        var div = 2**parseInt(Offset.value);
        var tlbVal = parseInt(TLB.value);
        var offsetVal = parseInt(Offset.value);
        var vmVal = parseInt(VM.value);
        var physVal = parseInt(PhysicalSize.value);

        //TLB table
        var rowNum = 1;
        for (var i = tlbVal -1; i>=0;i--)
        {
            var row = TLBtable.insertRow(rowNum);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = i;
            row++;
        }

        // Display and calculate Offset and Page bits

        var InstructionLength = Math.log2(vmVal);
        var row = VMtable.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = InstructionLength - offsetVal + " bits";
        cell2.innerHTML = offsetVal + " bits";

        //submit.onclick = null;
    }

    reset.onclick = function clearTable(){
        console.log("clicked");

        var rowCount = TLBtable.rows.length - 1;
        console.log(rowCount);
        for( var i = rowCount; i > 0; i--)
        {
            TLBtable.deleteRow(i);
        }

        VMtable.deleteRow(1);

       //submit.onclick = function createTable();
    }
}

//function toHex
