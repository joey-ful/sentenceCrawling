//notion login
const fs = require('fs');
const puppeteer = require('puppeteer');
const axios = require('axios');
const stringify = require('csv-stringify/lib/sync');
const dotenv = require('dotenv');
dotenv.config();


const crawler = async () => {
	try{
		const browser = await puppeteer.launch({ 
			headless: false,
			args: ['--window-size=1920,1080']
		});	//브라우저 띄우기
		const page = await browser.newPage();	//페이지 띄우기
		await page.setViewport({
			width: 1920,
			height: 1080,
		})
		await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
		await page.goto('https://www.notion.so/42-1fb86e5e2cb7475d96cbb7f693d50dd7', {
			waitUntil: 'networkidle0'	//페이지 안 컨텐츠가 다 로딩될 때까지 기다린다 (예. 싱글페이지 어플리케이션)
										//쓰면 안되는 경우: 유투브 (영상 다 로딩되기까지 기다리면 한참 걸림)
		})

		// notion logo click
		await page.waitForSelector('.notion-topbar div:nth-child(6)');
		await page.click('.notion-topbar div:nth-child(6)');
		

		// type email
		await page.waitForSelector('.notion-login input[type=email]');
		await page.type('.notion-login input[type=email]', process.env.EMAIL);


		// click "Continue with email"
		await page.waitForSelector('.notion-login div:nth-child(4)');
		await page.click('.notion-login div:nth-child(4)');
		
		// type password
		await page.waitForSelector('input[type=password]');
		await page.type('input[type=password]', process.env.PASSWORD);

		
		// click "Continue with password"
		await page.waitForSelector('.notion-login div:nth-child(6)');
		await page.click('.notion-login div:nth-child(6)');
		// await page.waitForNavigation({
		// 	waitUntil: 'networkidle2',
		// })

		// await page.click('.notion-page-content div:nth-child(8) > div > div > div');
		// await page.type('.notion-page-content div:nth-child(8) > div > div > div', 'hi')
		// await page.keyboard.type('hi');


		// await page.close();		//페이지 닫기
		// await browser.close();	//브라우저 닫기
	} catch (e) {
		console.error(e);
	}
}

crawler();