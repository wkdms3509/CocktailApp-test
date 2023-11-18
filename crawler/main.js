const { Builder, By, until, Key } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const config = require('./config')
const { pool } = require('./db')

let driver

const options = new chrome.Options()
options.addArguments(
  // '--headless',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-sandbox',
  // '--remote-allow-origins=*',
)

let item_Id = 1
let item_Detail_Id = 1

;(async function example() {
  driver = await new Builder()
    .forBrowser('chrome')
    // .usingServer('http://localhost:4444/wd/hub')
    // .usingServer('http://chrome:4444/wd/hub')
    .usingServer('http://selenium_chrome:4444/wd/hub')
    .setChromeOptions(options)
    .build()

  try {
    await driver
      .manage()
      .setTimeouts({ implicit: 10000000, pageLoad: 20000, script: 20000 })

    await goPage(config, 20000)

    const loadBtn = await getBtnByPageType(config)

    let i = 0
    while (i < getPageCount(config)) {
      i += 1
      await LoadAllItem(i, loadBtn)
    }

    const crawlItems = []
    const allItemList = await getItemList(config)

    console.log('allItemList : ', allItemList.length)

    for (let i = 0; i < allItemList.length; i++) {
      const item = await crawlItem(config, allItemList[i])
      crawlItems.push(item)
    }

    const crawlItemsDetail = []

    for (let i = 0; i < crawlItems.length; i++) {
      try {
        const elementResult = await goItemPage(1000, crawlItems[i])
        const itemDetail = await crawlItemDetail(500, elementResult, i)
        crawlItemsDetail.push(itemDetail)
      } catch (error) {
        console.error('항목 페이지 탐색 오류:', error)
      }
    }

    const crawlResult = mergeArr(crawlItems, crawlItemsDetail)

    console.log('crawl 완료')

    await saveDB(crawlResult)
  } catch (error) {
    console.log('Error:', error.message)
  } finally {
    await driver.quit()
  }
})(config)

// -----------------------

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const wrapSlept = async () => {
  await sleep(2000)
}

async function goPage(config, ms) {
  await driver.get(config.homeUrl)
  await wrapSlept(ms)

  if (!config.popup_selector) {
    return
  }

  if (config.popup_selector) {
    await driver.findElement(By.id(config.popup_selector)).click()
  }
}

async function getBtnByPageType(config) {
  if (!config.has_loadMore_Btn) {
    return 'There are no button.'
  }
  if (config.has_loadMore_Btn) {
    return await driver.findElement(By.css(config.load_selector.css))
  }
}

function getPageCount(config) {
  if (!config.is_infinity_scroll) {
    console.log(config.pageItemSize)
    return config.pageItemSize
  }
  if (config.is_infinity_scroll) {
    // return 999
    return 15
    // return 1
  }
}

async function scrollToElement(element) {
  await driver.executeScript(
    'arguments[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })',
    element,
  )
  //   await driver.executeScript(`window.scrollTo(0, 600 * (${i} + 1))`)
  await sleep(2000) // 스크롤 이후 잠시 대기
}

async function LoadAllItem(i, loadBtn) {
  await sleep(1000)
  await scrollToElement(loadBtn)
  await loadBtn.click()
}

async function getItemList(config) {
  return await driver.findElements(By.css(config.item_selector))
}

async function crawlItem(config, item) {
  await sleep(500)
  const result = {
    id: item_Id++,
    name: await item.findElement(By.css(config.name_selector)).getText(),
    type: await item.findElement(By.css(config.type_selector)).getText(),
    img: await item
      .findElement(By.css(config.img_selector))
      .getAttribute('src'),
    url: await item.getAttribute('href'),
  }

  return result
}

async function goItemPage(ms, item) {
  try {
    wrapSlept(ms)
    await driver.get(item.url)

    const contentElement = await driver.findElement(By.className('HomeContent'))
    const text = await contentElement.getText()
    if (text === '') {
      return null
    }
  } catch (error) {
    console.error('상세페이지 이동 에러:', error.message)
  }
}

async function getTasteInfo(selector) {
  try {
    const taste = driver.findElement(
      By.css(
        `#__next > div.Home.Home_Home__r7pEu.Cocktail.Cocktail_Cocktail__uUb_2 > main > article > section.Section.Cocktail_cocktailInfoSection___cPmp.b-greige.p0 > div > div > div:nth-child(2) > div.Cocktail_TasteProfile__5L4Fv > ${selector}`,
      ),
    )
    return await taste.getAttribute('style')
  } catch (error) {
    return '내용없음'
    console.log('에러' + error)
  }
}

async function getItemDesc(selector) {
  try {
    const desc2 = await driver.findElement(
      By.css(
        '#__next > div.Home.Home_Home__r7pEu.Cocktail.Cocktail_Cocktail__uUb_2 > main > article > section.Section.Cocktail_cocktailInfoSection___cPmp.b-greige.p0 > div > div > div:nth-child(1) > p',
      ),
    )

    const text = await desc2.getText()
    if (text === '') {
      return '내용없음'
    }

    const innerP = await desc2.findElement(By.css('p:nth-child(1)'))

    if (innerP) {
      return await innerP.getText()
    } else {
      return '내용없음'
    }
  } catch (error) {
    return '내용없음'
    console.error(error)
  }
}

async function crawlItemDetail(ms, element, num) {
  try {
    wrapSlept(ms)

    if (
      element === null ||
      num == 159 ||
      num == 164 ||
      num == 167 ||
      num == 257 ||
      num == 265 ||
      num == 271 ||
      num == 292 ||
      num == 294 ||
      num == 299 ||
      num == 300 ||
      num == 303 ||
      num == 313
    ) {
      // console.log('if num : ', num)
      const item = {
        id: item_Detail_Id++,
        description: '내용없음',
        alcohol: '내용없음',
        bitter: '내용없음',
        sourness: '내용없음',
        sugar: '내용없음',
      }

      return item
    }

    const item = {
      id: item_Detail_Id++,
      description: (await getItemDesc('p:nth-child(1)')).toString(),
      alcohol: (await getTasteInfo('div:nth-child(2) > span > div')).toString(),
      bitter: (await getTasteInfo('div:nth-child(3) > span > div')).toString(),
      sourness: (
        await getTasteInfo('div:nth-child(4) > span > div')
      ).toString(),
      sugar: (await getTasteInfo('div:nth-child(5) > span > div')).toString(),
    }
    // console.log('2. item : ', item.id, item.description)
    // console.log('-------------------')
    return item
  } catch (error) {
    console.error('crawlItemDetail 에러', error)
  }
}

function mergeArr(arr1, arr2) {
  console.log('mergeArr')
  const map = new Map()
  arr1.forEach((item) => map.set(item.id, item))
  arr2.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }))
  const mergeArray = Array.from(map.values())
  return mergeArray
}

async function saveDB(arr) {
  console.log('db push 시작')
  const saveQuery = `INSERT INTO cocktail2 SET ?`
  arr.forEach(async (item) => {
    const {
      name,
      type,
      img,
      description,
      alcohol,
      bitter,
      sourness,
      sugar,
    } = item

    const sliceDesc = description.split('')
    const maxDescLength = 500
    const truncatedDesc =
      sliceDesc.length > maxDescLength
        ? sliceDesc.slice(0, maxDescLength).join('')
        : description

    await pool.query(saveQuery, {
      name,
      type,
      img,
      description: truncatedDesc,
      alcohol,
      bitter,
      sugar,
      sourness,
    })
  })
  console.log('db 데이터 세팅 완료')
  return
}
