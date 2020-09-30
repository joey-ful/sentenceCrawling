//getting Easy Writing phrases from a NAVER blog
const fs = require('fs');
const puppeteer = require('puppeteer');
const axios = require('axios');
const stringify = require('csv-stringify/lib/sync');


fs.readdir('result', (err) => {
	if (err) {
		console.log('result 폴더가 없어 생성합니다')
		fs.mkdirSync('result');
	}
});


const crawler = async () => {
	try{
		const browser = await puppeteer.launch({ 
			headless: false,
		});	//브라우저 띄우기
		const page = await browser.newPage();	//페이지 띄우기
		await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
		await page.goto('http://blog.naver.com/PostList.nhn?blogId=magpie777&from=postList&categoryNo=48', {
			waitUntil: 'networkidle0'
		});	//페이지 접속

		let nb = [];
		for (let i = 2; i <= 12; i++)
			nb.push(i);
		const days = ['(월)', '(화)', '(수)', '(목)', '(금)'];
		const months = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		let str = '';
		for (let i = 1; i <= 5; i++) {
			// const iframe = page.frames().find(frame => frame.name() === 'mainFrame');
			const link = await page.$eval(`.blog2_categorylist tr:nth-child(${6 - i}) a`, element => element.href);	
			const pageI = await browser.newPage();
			await pageI.goto(link);

			let month = '';
			let date = '';
			let k = 0;
			let title = await pageI.$$eval('.se-fs-.se-ff-', element => element[0].textContent);
			while (title[k] != ' ')
				k++;
			date = title.substring(1, k);
			let l = k;
			while (title[l] != ']')
				l++;
			let monthstr = title.substring(k + 1, l); 
			month = months.indexOf(monthstr);

			const result = [];
			result[0] = [`${month}월 ${date}일${days[i - 1]}`];
			for (const [j, n] of nb.entries()) {
				// const iframeI = pageI.frames().find(frame => frame.name() === 'mainFrame');
				// console.log('iframeI', iframeI)
				const text = await pageI.$$eval(`.se-module.se-module-text p:nth-child(${n})`, element => element[0].textContent);
				if (text != '') {
					if ((n - 1) < 5)
						result[n - 1] = [`${(n - 1)%5}. ${text}`];
					else if (7 <= (n - 1)  && (n - 1) <= 10)
						result[n - 1] = [`${(n - 2)%5}. ${text}`]
					else if ((n - 1) == 5 || (n - 1) == 11)
						result[n - 1] = [`5. ${text}`];
					else if (n - 1 == 6)
						result[n - 1] = [''];
				}
				result.push(['']);
			}
			await pageI.close();
			str += stringify(result).replace(/\"/g, '');
			
		}
		fs.writeFileSync('result/result.md', str);
		await page.close();		//페이지 닫기
		await browser.close();	//브라우저 닫기
	} catch (e) {
		console.error(e);
	}
}

crawler();