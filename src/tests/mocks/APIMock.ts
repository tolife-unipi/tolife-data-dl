import API from "../../utils/API";
import crypto from "crypto"

export default class APIMock extends API {

	kits_id:string[];
	lenght_results:number;

	constructor(kits_id:string[], lenght_results:number = 50) {
		super(new URL('http://example.com'), '', '');
		this.kits_id = kits_id;
		this.lenght_results = lenght_results;
	}

	async authorize(): Promise<Response> {
		return new Promise(res => res(Response.json({
			"access_token": "llUllUllUlUUUlU0UlUlUlU0lUUlUlUlUllUUllll0llUlU0UUUUlUlUlUllllU0llUUUlUUlUl0U0Ull0U0lUUlUUUlUU0UU000UlUUUUllUl0.llUllUUlUlU0UUU0UUUlUUUlUllllUU0UUU0UUU0UlU0UUllllUlUlllUUllUlllUUUlUUUlUl00UlUlUUUlUUUlUlUlUlllUUUlUUllUllllUUlUllllUU0lUU0Ul0lUUlllU0lll00UUUlUUUlUUlll0UlUlUlU0UlUUllll00l0llUlUlUUUllUUlUlUlU0UllU00Ullll0UlUlllUUU0UUUlUlUlUUl0Ul00UUUlUUUlUUUlUUUlUlllUUUlUUUlUllllUllUlllUlUlllUlUlllUUllUlllUlUlllUlllUlUUUlUUUllU0lU0U0UUUlUlllUlU0UlUlUUUlUUU0Ul00UlU0UUUlUlUlUUU0UlUlUlUlUll0UlllUUUlUlllUUUlUlUlUUllU0UlU0UlllU0llUll0llllU0UlUlUUUllUl0UUUllUUlUUUllUllUUUlUlUllUUllUUlUUllllUlUlUllUllllUlUUUlUlUllU0lU0UlU0UlllUlUlUlUU0llUUll0UlllU0lU0lUl00UUUlUUUllUUlUU0lU0Ull0UlUlllUUUll0UllUU0llUll0llllU0UlUlUU0lU0UlUUUll0UllUUlUl0lllUlUU0lU0UllU00UUllllllUlllllllll0lll0llUllUl00lUlll0UllUUlUlUllUUllUUllUUlUlllUUUllUUllUUlUlUlUUU0UlUlUlUlUUllUUU0UUUlUUU0Ul0lUUUlUUUlUUUlUUUlUlU0UUUlUlUlUUllU0UllllllUUlUll0llUlUUUlUU0lUllllUUlll0llUUllUUllU0llUUlUUUlllUlUUUlUUUllUUlll0llUUlUlU0lllllU00UUU0U0UlUUUlUUUllUUlll0lUU0lUllllUUlll0llUUlUUUlUU0llUllllUlUUU0Ullll0UlUU0lUlllUU0llUllUlU0lllllU00UUU0U0UlUUUUlU0llUlllUUllU.U0ll-UUU0Ulllll0lUUllUlUl_l0lUlUUU_0UlUU000lU0lUl0ll0UU00UUl0Ul0lUUlUlU-UUl0lUlUll0l0Ul00UUlUl0ll0lll0UlUUlUlUlU0llUUlll_00lUll00l0lUllllUlllllllll0lUUlUlUllUUUU0lUU-lU0U0lUUlU00lUUUlUlUUll0UUlUllU-0lUUUlUl0Ull0U0UUlUlUlUll-l0UlUll0Ull0UlUl0_lUllUUUlll0lUUU0UUllUllUUllllUUUlUU00lUU_lUl-ll00UlU-U00U0lUUU_UUllllUU0l0U00l0lllllUll0l0UlUl-U00lU",
			"expires_in": 36000,
			"refresh_expires_in": 1800,
			"refresh_token": "llUllUllUlUUUlU0UlUlUlU0lUUlUlUlUllUUllll0llUlU0UUUlUlU0UUU0UU00UUUlUUUlUlUlUlU0Ul0lUlUlUUUlUll0U0UllU.llUllUUlUlU0UUU0UUllUUUlUllllUU0UUU0UUU0UlU0UUllllUlUlllUUl0UUllUUUlUlUlUl00UlUlUUUlUUUlUUllUUllUlUlUUUlUllllUUlUllllUU0lUU0Ul0lUUlllU0lll00UUUlUUUlUUlll0UlUlUlU0UlUUllll00l0llUlUlUUUllUUlUlUllUUlllllU0lllUUll0UlUlUlU0llUUllU0UllUUlUUUlllUllU0lU0UllUllUUUlUlU0UlU0UlUlUlU0UUUlUUU0UlUlUUUlUU0lUUllUUU0UUU0UlUlUlUlUUUlUlU0lUU0UlUlUlUll0llUUUlllUlUlUlll0llUUlUUUlUlUll0Ull00ll0UllUUlUlU0UUllUlU0UU0lUUUlUUUlUUllUUUlUU00UUllU0UlUUUlUlllUUUlU00lUUU0Ul0lUU0lUUUlll0llUllUUUlUUllUllll0llUlllUlU0UlUlUUUlUUU0Ul00UlU0UUUlUlUlUUU0UlUlUlUlUll0Ul0.lUllUlllllUUllllUllllUlll00_UU0UlUUUl0lUUUl",
			"token_type": "Bearer",
			"id_token": "llUllUllUlUUUlU0UlUlUlU0lUUlUlUlUllUUllll0llUlU0UUUUlUlUlUllllU0llUUUlUUlUl0U0Ull0U0lUUlUUUlUU0UU000UlUUUUllUl0.llUllUUlUlU0UUU0UUUlUUUlUllllUU0UUU0UUU0UlU0UUllUUU0lU00lU0lUlllUUUllUllUlUlUUUlUUllUl0lUlU0UUU0UlUlUUllUl00U0U0UUU0UlUlUUUlUUUll0UlUlUllUUlllllU0lllUUll0UlUlUlU0llUUllU0UllUUlUUUlllUllU0lU0UllUllUUUlUlU0UUU0UlUll000UU0lUllll0UlUlllUUU0UUUlUlUlUUl0Ul00UUUlUUUlUUUlUUUlUlllUUUlUUUlUllllUllUlllUUUlUUUlllUlUlUlll0llUUlUUUlUlUll0Ull00ll0UllUUlUlU0UUllUlU0UU0lUUUlUUUlUUllUUUlUU00UUllU0UlUUUlUlllUUUllU0lUUUlUllll0llU0lUlUU0UlUlllllUlUlUlUUUlUlUlUlllU0UlUlUUUllUUlUlU0UUllUlU0UU0lUUUlUUUlUUllUUUlUU00UUllU0UlUUUlUlllUUUllUUllU00UUUlUlllUUU0lUU0UUllllUlUUU0UlUlUUUlUU0lUUlll0UlUU0lUllllUUlUlUlllUlU0UlUUUlUU0lUllllU0llUlllUUllU00l0UlUlllU0l0UU0lllUlUUU0UlUlUUUlUU0lUlllUlUllUl0U00llUUlUlUlUUU0llUlUUUlUlUlUUllUllllU0llUlllUUllU00l0UlUUUllUUlUll0Ul0.ll0Ul00l0llUUUl0UllUUllUlU0lUUl0lUUl_lUUUlUUl0UllUUllUUUl_Ulll0lU0Ulll0lUUlll_llllUlUUlllUllUllUlll0ll0UlUUllUlU-UllllU00lUUlUUU0lUUU00llU0lllUU0ll0lllUUUl-lU0UlllUUU0-lU0l000llllUUUUllUU0Ul00lUUlUUUlU0UU0llUllllUUUlUl0-l00lU0UlUlUUUllUllllUUU0lUlUUUUlUUl0llU-0UlU0U0Ul0ll0lUllUUUU0UUll0Ul0lUUUlUUlUUllU0U0lU0UUUl0-lUlUllUU00lU-ll00llUUUl0l_l",
			"not-before-policy": 1695572384,
			"session_state": "0l000000-l00l-0l00-lll0-0l000l0l0000",
			"scope": "openid profile email"
		})));
	}

	async getSensorsData(sensor_name:string, start_date:string, end_date:string): Promise<Response> {
		if(sensor_name === 'ACC_PHONE' || sensor_name === 'ACC_WATCH' || sensor_name === 'GYR_PHONE' || sensor_name === 'GYR_WATCH')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				x: Math.random()*10,
				y: Math.random()*10,
				z: Math.random()*10,
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'ACC_SHOE_LEFT' || sensor_name === 'ACC_SHOE_RIGHT' || sensor_name === 'GYR_SHOE_LEFT' || sensor_name === 'GYR_SHOE_RIGHT')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				counter: Math.floor(Math.random() * 256),
				timeBoard: Math.floor(Math.random() * 256),
				x: Math.random()*10,
				y: Math.random()*10,
				z: Math.random()*10,
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'BAT_PHONE' || sensor_name === 'BAT_WATCH')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				level: Math.floor(Math.random()*400 - 200),
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'HEART_RATE_WATCH')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				heartRate: Math.floor(Math.random()*120),
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'LIGHT_WATCH' || sensor_name === 'MIC_PHONE' || sensor_name === 'MIC_WATCH')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				intensity: Math.floor(Math.random()*256),
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'PPG_WATCH')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				PPG5: Math.random() * 3e-39,
				PPG7: Math.random() * 3e-39,
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'PRESS_SHOE_LEFT' || sensor_name === 'PRESS_SHOE_RIGHT')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				counter: Math.floor(Math.random() * 256),
				press1: Math.floor(Math.random() * 1500),
				press2: Math.floor(Math.random() * 1500),
				press3: Math.floor(Math.random() * 1500),
				timeBoard: Math.floor(Math.random() * 256),
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else if(sensor_name === 'STEP_PHONE' || sensor_name === 'STEP_WATCH')
			return new Promise(res => res(Response.json(Array(this.lenght_results).fill(0).map((_, i) => ({
				_id: crypto.randomBytes(12).toString("hex"),
				numStep: Math.floor(Math.random() * 256),
				kit_id: this.kits_id[i % this.kits_id.length],
				timestamp: new Date(new Date(start_date).getTime() + Math.random() * (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().slice(0,-5)
			})))));
		else
			return new Promise(res => res(Response.json([])));
	}

	async getSensorsName(): Promise<Response> {
		return new Promise(res => res(Response.json([
			"ACC_PHONE","BAT_PHONE","GPS_PHONE","GYR_PHONE","MIC_PHONE","STEP_PHONE",
			"ACC_SHOE_LEFT","BAT_SHOE_LEFT","GYR_SHOE_LEFT","PRESS_SHOE_LEFT",
			"ACC_SHOE_RIGHT","BAT_SHOE_RIGHT","GYR_SHOE_RIGHT","PRESS_SHOE_RIGHT",
			"ACC_WATCH","BAT_WATCH","GPS_WATCH","GYR_WATCH","MIC_WATCH","STEP_WATCH","LIGHT_WATCH","PPG_WATCH","HEART_RATE_WATCH"
		])));
	}
}