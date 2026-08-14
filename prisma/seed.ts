import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Default Master SaaS Organization (EducaTech)
  const educatechOrg = await prisma.organization.upsert({
    where: { slug: 'educatech' },
    update: {
      name: 'EducaTech Online Islamic School',
    },
    create: {
      name: 'EducaTech Online Islamic School',
      slug: 'educatech',
      primaryColor: '#064e3b',
      secondaryColor: '#d97706',
    },
  })

  // 2. Create Secondary Registered Tenant School (Demo Al-Azhar)
  const alAzharOrg = await prisma.organization.upsert({
    where: { slug: 'al-azhar' },
    update: {
      name: 'Al-Azhar Quranic Institute',
    },
    create: {
      name: 'Al-Azhar Quranic Institute',
      slug: 'al-azhar',
      primaryColor: '#1e3a8a',
      secondaryColor: '#f59e0b',
    },
  })

  // 3. Create Teacher (Sheikh Ibrahim)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@educatech.org' },
    update: {
      organizationId: educatechOrg.id,
    },
    create: {
      email: 'teacher@educatech.org',
      name: 'Sheikh Ibrahim',
      passwordHash,
      type: 'TEACHER',
      organizationId: educatechOrg.id,
      teacherProfile: {
        create: {
          riwayatMastery: JSON.stringify(['Hafs', 'Warsh', 'Qalun']),
          certificates: 'Ijazah in Ten Qiraat, PhD in Islamic Studies',
          languages: 'Arabic, English, Urdu',
          availabilitySchedule: JSON.stringify({
            monday: ['09:00', '11:00'],
            tuesday: ['09:00', '11:00'],
          }),
          hourlyRate: 25.0,
          rating: 4.9,
          ijazahVerified: true,
          bio: 'Senior reciter with 20 years of experience teaching global students.',
        },
      },
    },
    include: {
      teacherProfile: true,
    },
  })

  // 4. Create Student (Zaid Ahmad)
  const student = await prisma.user.upsert({
    where: { email: 'student@educatech.org' },
    update: {
      organizationId: educatechOrg.id,
    },
    create: {
      email: 'student@educatech.org',
      name: 'Zaid Ahmad',
      passwordHash,
      type: 'STUDENT',
      organizationId: educatechOrg.id,
      studentProfile: {
        create: {
          currentLevel: 'Intermediate',
          learningGoals: 'Mastering Tajweed, Hifz Al-Baqarah',
          targetRiwayah: 'Hafs',
        },
      },
    },
    include: {
      studentProfile: true,
    },
  })

  // 5. Create Parent (linked to Zaid)
  await prisma.user.upsert({
    where: { email: 'parent@educatech.org' },
    update: {
      organizationId: educatechOrg.id,
    },
    create: {
      email: 'parent@educatech.org',
      name: 'Parent Abdullahi',
      passwordHash,
      type: 'PARENT',
      organizationId: educatechOrg.id,
      parentProfile: {
        create: {
          students: {
            connect: { id: student.studentProfile?.id },
          },
        },
      },
    },
  })

  // 6. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@educatech.org' },
    update: {
      organizationId: educatechOrg.id,
    },
    create: {
      email: 'admin@educatech.org',
      name: 'EducaTech Super Admin',
      passwordHash,
      type: 'ADMIN',
      organizationId: educatechOrg.id,
    },
  })

  // 7. Create an Application (Pending)
  await prisma.application.create({
    data: {
      userId: student.id,
      organizationId: educatechOrg.id,
      type: 'STUDENT',
      status: 'PENDING',
      feePaid: true,
      submittedData: JSON.stringify({
        track: 'Hifz Intensive',
        previousExperience: 'Juza Amma complete',
        preferredSchedule: 'Weekend Mornings',
      }),
    },
  })

  // 8. Create Classes
  const studentClass = await prisma.class.create({
    data: {
      type: 'INDIVIDUAL',
      teacherId: teacher.teacherProfile!.id,
      organizationId: educatechOrg.id,
      riwayah: 'Hafs',
      level: 'Intermediate',
      schedule: JSON.stringify({ day: 'Monday', time: '10:00 AM' }),
      students: {
        connect: { id: student.studentProfile!.id },
      },
    },
  })

  // 9. Create Attendance logs
  await prisma.attendance.create({
    data: {
      classId: studentClass.id,
      studentId: student.studentProfile!.id,
      status: 'PRESENT',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
  })
  await prisma.attendance.create({
    data: {
      classId: studentClass.id,
      studentId: student.studentProfile!.id,
      status: 'LATE',
      date: new Date(), // today
    },
  })

  // 10. Create Assessments (Grades)
  await prisma.assessment.create({
    data: {
      studentId: student.studentProfile!.id,
      teacherName: 'Sheikh Ibrahim',
      subject: 'Surah Al-Fatihah Evaluation',
      tajweedScore: 95,
      hifzScore: 100,
      fluencyScore: 92,
      feedback: 'Excellent recitation. Makharij points are pristine. Just maintain regular revision.',
    },
  })

  // 11. Create Payments
  await prisma.payment.create({
    data: {
      userId: student.id,
      organizationId: educatechOrg.id,
      amount: 195000.0,
      status: 'succeeded',
      gatewayResponse: JSON.stringify({ id: 'ch_12345', brand: 'visa' }),
    },
  })

  // 12. Create Pricing Plans for Master SaaS & Tenant
  const plans = [
    {
      name: 'Foundation',
      price: 140000.0,
      description: 'Perfect for individual learners beginning their Quranic journey.',
      features: JSON.stringify([
        '2 classes per week (30 min)',
        'Verified Hafs Teacher',
        'Basic Tajweed Curriculum',
        'Digital Study Materials',
        'Progress Reports',
      ]),
      isPopular: false,
      organizationId: educatechOrg.id,
    },
    {
      name: 'Specialization',
      price: 195000.0,
      description: 'Intensive learning with focus on specific Riwayah mastery.',
      features: JSON.stringify([
        '3 classes per week (30 min)',
        'Choice of any Riwayah',
        'Advanced Tajweed Rules',
        'Certificate of Completion',
        'Class Recordings Access',
        'Direct Chat with Teacher',
      ]),
      isPopular: true,
      organizationId: educatechOrg.id,
    },
    {
      name: 'Hifz Intensive',
      price: 280000.0,
      description: 'Comprehensive memorization program with daily tracking.',
      features: JSON.stringify([
        '5 classes per week (30 min)',
        'Master Hifz Teacher',
        'Personalized Hifz Plan',
        'Ijazah Certification Track',
        'Monthly Evaluation Sessions',
        'Priority Scheduling',
      ]),
      isPopular: false,
      organizationId: educatechOrg.id,
    },
  ]

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { name: plan.name },
      update: { organizationId: plan.organizationId },
      create: plan,
    })
  }

  console.log('EducaTech Multi-Tenant Database seeded successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
