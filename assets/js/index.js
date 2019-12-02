const contractSource = `
contract LifeHack = 
    record lifeHack = 
        {name : string,
        creatorsAddress : address,
        tutorial : string,
        image : string,
        time : int }

    record state =
        {lifeHacks : map(int,lifeHack),
         length : int }

    entrypoint init() = { lifeHacks = {}, length  = 0}

    entrypoint getLength () =
        state.length

    stateful entrypoint addHack(name' : string, tutorial' : string, image':string ) = 
        let newHack = {
            name = name',
            creatorsAddress = Call.caller,
            tutorial = tutorial',
            image = image',
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

const contractAddress = 'ct_2GxQskSkkr7exbKu4uTaDyzvTLXze3cd7pntk43uXEqTdU5zFb'

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


window.addEventListener('load', async()=> {
    $('#loadings').show()
    console.log("Rendering")
    client = await Ae.Aepp() 

    hacklength = await callStatic('getLength' , [])

    for(let i=1 ; i<= hacklength; i++){

        getHack = await callStatic('getHack', [i])

        HackArray.push({
            name : getHack.name,
            image : getHack.image,
            tutorial : getHack.tutorial,
            time : getHack.time
        })

    renderHack();

    $('#loadings').hide()

    console.log("pushed successfully")




    }
} )


$('#regButton').click(async () =>{
  names = $('#title').val();
  images = $('#imageUrl').val();
  tutorials= $('lifeHack').val();

  console.log(tutorial)

  id  =  HackArray.length + 1
  await contractCall('addHack', [name,tutorial,image], 0)
  newHack = await callStatic('getHack', [id])

  HackArray.push({
    name : newHack.name,
    image : newHack.image,
    tutorial : newHack.tutorial,
    time : newHack.time
  })



} )
  
  