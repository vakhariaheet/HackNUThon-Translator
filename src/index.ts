import Express from 'express';
import cors from 'cors';
import Client from './Models/Client';
import { compare, hash } from './utils/Hash';
import SignJWT from './utils/SignJWT';
import Template from './Models/Template';
import VerifyUser from './Middleware/VerifyUser';
import TranslateObj from './utils/TranslateObj';
import Request from './Models/Request';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { sendResponse } from './utils/Response';

dotenv.config();
const app = Express();

app.use(cors());
app.use(Express.json());

(async () => {
	await mongoose.connect(process.env.MONGODB_URI as string, {});
	console.log('DB Connected');
})();

app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return sendResponse({
			res,
			data: {},
			status: 400,
			message: 'Missing email or password',
		});
	}
	const user = await Client.findOne({ email: email }).lean();
	if (!user) {
		return sendResponse({
			res,
			data: {},
			status: 404,
			message: 'User Not Found',
		});
	}

	if (!compare(password, user.password || '')) {
		return sendResponse({
			res,
			data: {},
			status: 404,
			message: 'User Not Found',
		});
	}
	const token = SignJWT.sign(
		{
			email,
			type: 'client',
			created_on: Date.now(),
			userId: user._id,
		},
		process.env.JWT_SECRET as string,
	);
	return sendResponse({
		res,
		data: {
			token,
			user,
		},
		status: 200,
		message: 'Login Successful',
	});
});

app.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return sendResponse({
			res,
			data: {},
			status: 400,
			message: 'Missing name, email or password',
		});
	}
	try {
		await Client.insertMany([
			{
				name,
				email,
				password: hash(password),
			},
		]);
		const data = await Client.findOne({ email: email }).lean();

		const token = SignJWT.sign(
			{
				email,
				type: 'client',
				created_on: Date.now(),
				userId: data?._id,
			},
			process.env.JWT_SECRET as string,
		);
		return sendResponse({
			res,
			data: {
				token,
				user: data,
			},
			status: 201,
			message: 'Register Successful',
		});
	} catch (err) {
		console.log(err);
		return sendResponse({
			res,
			data: {
				err,
			},
			status: 500,
			message: 'Error',
		});
	}
});

app.post('/template/create', VerifyUser, async (req: any, res) => {
	const { template } = req.body;

	if (!template) {
		return sendResponse({
			res,
			data: {},
			status: 400,
			message: 'Missing template',
		});
	}
	try {
		await Template.insertMany([{ ...template, clientID: req.user.userId }]);

		const data = await Template.find({clientID:req.user.userId}).sort({createdAt:-1}).limit(1).lean();
        return sendResponse({
            res,
            data,
            status: 201,
            message: 'Template Created',
        })
	} catch (err) {
		console.log(err);
        return sendResponse({
            res,
            data: {
                err
            },
            status: 500
        })
	}
});

app.get('/template', VerifyUser, async (req:any, res) => {
	try {
        const data = await Template.find({
            clientID: req.user.userId,
        }).lean();
        sendResponse({
            res,
            data,
            status: 200,
            
        })
	} catch (err) {
		console.log(err);
        sendResponse({
            res,
            data: { err },
            status: 500,
        });
	}
});

app.patch('/template/update', VerifyUser, async (req:any, res) => {
	try {
		const { template, id } = req.body;
		if (!template || !id) {
            return sendResponse({
                res,
                data: {},
                status: 400,
                message: 'Missing template or id',

            });
		}
		const data = await Template.updateOne({ id }, {...template,clientId:req.user.userId}, {
			new: true,
		});
        return sendResponse({
            res,
            data,
            status: 200,
            message: 'Template Updated',

        })
	} catch (err) {
		console.log(err);
        return sendResponse({
            res,
            data: { err },
            status: 500,
        })
	}
});

app.delete('/template/delete', VerifyUser, async (req, res) => {
	const { id } = req.body;

	if (!id) {
        return sendResponse({
            res,
            data: {},
            status: 400,
            message: 'Missing id',
            
        })
	}
	try {
        await Template.findByIdAndDelete(id);
        return sendResponse({
            res,
            data: {},
            status: 200,
            message: 'Template Deleted',

        })
	} catch (err) {
		console.log(err);
        return sendResponse({
            res,
            data: { err },
            status: 500,
        })
	}
});

app.post('/translate', VerifyUser, async (req: any, res) => {
	const { data, templateId } = req.body;
	if (!data || !templateId) {
        return sendResponse({
            res,
            data: {},
            status: 400,
            message: 'Missing data or templateId',
        })
	}
	try {
		const template = (await Template.findOne({
			_id: templateId,
		}).lean()) as any;

		const result = await TranslateObj(data, template);
		await Request.create({
			clientId: req.user.userId,
			templateId,
		});
        return sendResponse({
            res,
            data: result,
            status: 200,
            message: 'Translation Successful',
        })
	} catch (err) {
		console.log(err);
        return sendResponse({
            res,
            data: { err },
            status: 500,
        })
	}
});

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
