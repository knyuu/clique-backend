import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const otherCities = ['Hà Nội', 'Đà Lạt', 'Đà Nẵng', 'Vũng Tàu', 'Bến Tre'];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        await User.deleteMany({});
        console.log('Cleared existing users.');

        const users = [];
        const salt = await bcrypt.genSalt(10);
        const hashedSharedPassword = await bcrypt.hash('password123', salt);

        console.log('Generating 500 users...');

        for (let i = 0; i < 500; i++) {
            let city = '';
            if (i < 250) {
                city = 'Thành phố Hồ Chí Minh';
            } else {
                city = otherCities[(i - 250) % otherCities.length];
            }

            let genderValue = '';
            let fakerSex = '';
            
            if (i < 350) {
                genderValue = 'Female';
                fakerSex = 'female';
            } else {
                genderValue = 'Male';
                fakerSex = 'male';
            }

            const name = faker.person.fullName({ sex: fakerSex });

            users.push({
                name: name,
                email: faker.internet.email().toLowerCase(),
                password: hashedSharedPassword,
                age: faker.number.int({ min: 18, max: 35 }),
                gender: genderValue,
                city: city,
                genderPreference: genderValue === 'Female' ? 'Male' : 'Female',
                avatar: `https://i.pravatar.cc/600?u=${faker.string.uuid()}`,
                bio: faker.lorem.paragraphs(2),
                isActivated: true,
                hasCompletedOnboarding: true,
            });
        }

        await User.insertMany(users);

        console.log(`SEED THÀNH CÔNG 500 USER!`);
        console.log(`Thống kê:`);
        console.log(`   - Giới tính: 350 Nữ | 150 Nam`);
        console.log(`   - Thành phố: 250 TP.HCM | 250 các tỉnh khác`);
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedUsers();