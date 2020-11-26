"use strict";

window.onload = function()
{
    let PhysicalSize = document.getElementById("pps");
    let Offset = document.getElementById("ofb");
    let VM = document.getElementById("vms");
    let TLB = document.getElementById("tlb");
    let Instruction = document.getElementById("Instruction");

    let reset = document.getElementById("reset");
    let submit = document.getElementById("submit");
    let instruct = document.getElementById("submitIn");

    var VMtable = document.getElementById("VirtualMemoryTable");
    var TLBtable = document.getElementById("TLBTable");
    var Pagetable = document.getElementById("PageTable");
    var PhysicalMemorytable = document.getElementById("PhysicalMemoryTable");


    submit.onclick = function createTable() {
        console.log("clicked");
    
        var div = 2**parseInt(Offset.value);
        var tlbVal = parseInt(TLB.value);
        var offsetVal = parseInt(Offset.value);
        var vmVal = parseInt(VM.value);
        var physVal = parseInt(PhysicalSize.value);
    
        // Display and calculate Offset and Page bits
    
        var InstructionLength = Math.log2(vmVal);
        var row = VMtable.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = InstructionLength - offsetVal + " bits";
        cell2.innerHTML = offsetVal + " bits";
    
        //TLB table
        var rowNum = 1;
        for (var i = 0; i < tlbVal;i++)
        {
            var row = TLBtable.insertRow(rowNum);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2)
            cell1.innerHTML = i;
            rowNum++;
        }
    
       //Page table
       var rowNum = 1;
       var pageRow = vmVal/div;
       for (var i = 0; i<pageRow;i++)
       {
           var row = Pagetable.insertRow(rowNum);
           var cell1 = row.insertCell(0);
           var cell2 = row.insertCell(1);
           var cell3 = row.insertCell(2);
    
            cell1.innerHTML = toHex(i);
            cell2.innerHTML = 0;
    
            rowNum++;
       }
       //Physical page
        var rowNum = 1;
        var physRow = physVal/div;
        for(var i=0; i<physRow;i++){
            var row = PhysicalMemorytable.insertRow(rowNum);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            cell1.innerHTML = toHex(i);
            rowNum++;
        }
       
    
        submit.onclick = null;
        return false;
        
    }

    reset.onclick = function clearTable() {
        console.log("clicked");

        // clear TBL table
        var rowCount = TLBtable.rows.length - 1;
        for( var i = rowCount; i > 0; i--)
        {
            TLBtable.deleteRow(i);
        }

        // clear VM table
        var rowCount = VMtable.rows.length - 1;
        for( var i = rowCount; i > 0; i--)
        {
            VMtable.deleteRow(i);
        }
        
        // clear Page table
        var rowCount = Pagetable.rows.length - 1;
        for( var i = rowCount; i > 0; i--)
        {
            Pagetable.deleteRow(i);
        }
        //clear PhysicalMemorytable
        var rowCount = PhysicalMemorytable.rows.length - 1;
        for( var i = rowCount; i > 0; i--)
        {
            PhysicalMemorytable.deleteRow(i);
        }

        submit.onclick = function createTable(){
            console.log("clicked");
        
            var div = 2**parseInt(Offset.value);
            var tlbVal = parseInt(TLB.value);
            var offsetVal = parseInt(Offset.value);
            var vmVal = parseInt(VM.value);
            var physVal = parseInt(PhysicalSize.value);
        
            // Display and calculate Offset and Page bits
        
            var InstructionLength = Math.log2(vmVal);
            var row = VMtable.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = InstructionLength - offsetVal + " bits";
            cell2.innerHTML = offsetVal + " bits";
        
            //TLB table
            var rowNum = 1;
            for (var i = 0; i < tlbVal;i++)
            {
                var row = TLBtable.insertRow(rowNum);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = i;
                rowNum++;
            }
        
           // Display Frame and off set 
        
           //Page table
           var rowNum = 1;
           var pageRow = vmVal/div;
           for (var i = 0; i<pageRow;i++)
           {
               var row = Pagetable.insertRow(rowNum);
               var cell1 = row.insertCell(0);
               var cell2 = row.insertCell(1);
               var cell3 = row.insertCell(2);
        
                cell1.innerHTML = toHex(i);
                cell2.innerHTML = 0;
        
                rowNum++;
           }
           //Physical page
           var rowNum = 1;
           var physRow = physVal/div;
           for(var i=0; i<physRow;i++){
              var row = PhysicalMemorytable.insertRow(rowNum);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
        
                cell1.innerHTML = toHex(i);
                rowNum++;
           }
           
        
            submit.onclick = null;
            return false;
        }
    }

    instruct.onclick = function updateTable(){
        var valBi =hexToBi(Instruction.value);
        var offsetVal = parseInt(Offset.value);

        // Display and calculate Offset and Page bits
        var row = VMtable.insertRow(2);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = bits(valBi,offsetVal);
        cell2.innerHTML = toBi(offsetVal);

        var tlbVal = parseInt(TLB.value);

        for (var i = 1; i < tlbVal; i++)
        {
            console.log("here: " + TLBtable.rows[i].cells[1].innerHTML)
            if (TLBtable.rows[i].cells[1].innerHTML == bits(valBi,offsetVal))
            {
                //check physical memory
                break;
            }
            else if(TLBtable.rows[i].cells[1].innerHTML == "")
            {
                TLBtable.rows[i].cells[1].innerHTML = bits(valBi,offsetVal);
                // get available slot in physical memory
                var num = emptyPhys(PhysicalMemorytable);
                TLBtable.rows[i].cells[2].innerHTML = num;
                PhysicalMemorytable.rows[parseInt(num)+1].cells[1].innerHTML = bits(valBi,offsetVal) + " DATA";
                page(Pagetable,bits(valBi,offsetVal),num);
                break;
                //get index in page table and enter information
            }
        }
        
    }
}

function toHex(num)
{
    return num.toString(16);
}

function toBi(num)
{
    return num.toString(2);
}
function hexToBi(num)
{
    return parseInt(num,16).toString(2);
}
 function biToHex(num)
 {
    return parseInt(num,2).toString(16);
 }

function bits(num,set){
    var l = num.toString().length
    var n = num.toString().substr(0,l-set);
    l = n.toString().length;
    var input = 9 - l;
    
    while (input > 0)
    {
        n = "0" + n;
        input--;
    }

    return n;
}

function emptyPhys(table)
{
    var len = table.rows.length;
    
    for(var i = 1; i < len; i++)
    {
        if (table.rows[i].cells[1].innerHTML ==  "")
        {
            return table.rows[i].cells[0].innerHTML;
        }
    }
}

function page(table,val,index)
{
    var len = table.rows.length;
  
    for(var i = 1; i < len; i++)
    {
        console.log(table.rows[i].cells[0].innerHTML);
        if (table.rows[i].cells[0].innerHTML == biToHex(val))
        {
           table.rows[i].cells[1].innerHTML = 1;
           table.rows[i].cells[2].innerHTML = index;
           break;
        }
    }
}