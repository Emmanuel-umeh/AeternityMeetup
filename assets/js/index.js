const contractSource = `
contract LifeHack = 
record lifeHack = 
    {name : string,
    creatorsAddress : address,
    tutorial : string,
    time : int }

record state =
    {lifeHacks : map(int,lifeHack),
     length : int }

entrypoint init() = { lifeHacks = {}, length  = 0}

entrypoint getLength () =
    state.length

stateful entrypoint addHack(name' : string, tutorial' : string ) = 
    let newHack = {
        name = name',
        creatorsAddress = Call.caller,
        tutorial = tutorial',
        time = Chain.timestamp }
    let index = getLength() + 1

    put(state{lifeHacks[index] = newHack, length = index })

entrypoint getHack(index : int) =
    state.lifeHacks[index]

payable stateful entrypoint tipUser(index : int, price : int) =  
    let user = getHack(index)

    Chain.spend(user.creatorsAddress, price)
    "Tipped Successfully "
    
`

const contractAddress = 'ct_25wvCKtZK6xGv6dH5tAB5z8YXAVwccmcKSkL7Na9LpjbvoA9Ap'

var client = null

var HackArray = []

function renderHack() {

    var template = $('#template').html();
  
    Mustache.parse(template);
    var rendered = Mustache.render(template, {
      HackArray
    });
  
  
  
  
    $('#body').html(rendered);
    console.log("Rendered")
  }
  
  async function callStatic(func, args) {
  
    const contract = await client.getContractInstance(contractSource, {
      contractAddress
    });
  
    const calledGet = await contract.call(func, args, {
      callStatic: true
    }).catch(e => console.error(e));
  
    const decodedGet = await calledGet.decode().catch(e => console.error(e));
  
    return decodedGet;
  }
  
  async function contractCall(func, args, value) {
    const contract = await client.getContractInstance(contractSource, {
      contractAddress
    });
    //Make a call to write smart contract func, with aeon value input
    const calledSet = await contract.call(func, args, {
      amount: value
    }).catch(e => console.error(e));
  
    return calledSet;
  }


document.addEventListener('load', async()=> {
    $('#loadings').show()
    console.log("Rendering")
    client = await Ae.Aepp() 

    hacklength = await callStatic('getLength' , [])

    for(var i; i<= hacklength; i++){

        getHack = await callStatic('getHack', [i])

        HackArray.push({
            name : getHack.name,
            tutorial : getHack.tutorial,
            time : getHack.time
        })

    renderHack();

    $('#loadings').hide()

    console.log("pushed successfully")




    }
} )
  
  