const { icons } = require('../../src/storage/disks')

const storage = require('../../src/storage/storage')


storage.download(icons.business,'001-trophy.svg')
.then((data:any) => {
    console.log(data)
})
.catch((error:any) => {
    console.error(error)
})
