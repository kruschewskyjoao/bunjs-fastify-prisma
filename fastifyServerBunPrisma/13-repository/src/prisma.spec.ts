import { PrismaClient } from '@prisma/client';
import { getNewProfile } from './__tests__/fixtures';
import { faker } from '@faker-js/faker';
import { expect, describe, it } from 'bun:test';

const prisma = new PrismaClient();

describe('testing prisma access', () => {
  it('create new profile', async () => {
    const {
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar } = getNewProfile();
    const profile = await prisma.profile.create({
      data: {
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar,
      },
    });

    expect(profile.userName).toBe(userName);
    expect(profile.fullName).toBe(fullName);
  });

  it('create new profile and message', async () => {
    const {
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar } = getNewProfile();

      const messages = [
        { body: faker.lorem.sentence(1 )},
        { body: faker.lorem.sentence(1 )},
        { body: faker.lorem.sentence(1 )},
      ]

    const profile = await prisma.profile.create({
      data: {
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar,
        messages: {
          create: messages,
        }
      },
      include: {
        messages: true,
      }
    });

    expect(profile.userName).toBe(userName);
    expect(profile.fullName).toBe(fullName);
    expect(profile.messages[0].body).toBe(messages[0].body);
    expect(profile.messages[1].body).toBe(messages[1].body);
    expect(profile.messages[2].body).toBe(messages[2].body);
  });

  it('update relationship of message', async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA 
    } = getNewProfile();
    const profileA = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA 
      },
    });

    const {
      userName: userNameB,
      fullName: fullNameB,
      description: descriptionB,
      region: regionB,
      mainUrl: mainUrlB,
      avatar: avatarB 
    } = getNewProfile();
    const profileB = await prisma.profile.create({
      data: {
        userName: userNameB,
        fullName: fullNameB,
        description: descriptionB,
        region: regionB,
        mainUrl: mainUrlB,
        avatar: avatarB
      },
    });

    let message = await prisma.message.create({
      data: {
        body: "123",
        authorId: profileA.id,
      },
    });
    expect(message.authorId).toBe(profileA.id);

    message = await prisma.message.update({
      where: { id: message.id },
      data: {
        authorId: profileB.id,
      }
    });

    expect(message.authorId).toBe(profileB.id);
  });

  it('update relation of message', async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA 
    } = getNewProfile();
    const profileA = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA 
      },
    });

    const {
      userName: userNameB,
      fullName: fullNameB,
      description: descriptionB,
      region: regionB,
      mainUrl: mainUrlB,
      avatar: avatarB 
    } = getNewProfile();
    let profileB = await prisma.profile.create({
      data: {
        userName: userNameB,
        fullName: fullNameB,
        description: descriptionB,
        region: regionB,
        mainUrl: mainUrlB,
        avatar: avatarB
      },
      include: {
        messages: true,
      }
    });

    let message = await prisma.message.create({
      data: {
        body: '123',
        authorId: profileA.id,
      },
    });

    profileB = await prisma.profile.update({
      where: { id: profileB.id },
      data: {
        messages: {
          connect: [{ id: message.id }]
        },
      },
      include: {
        messages: true,
      },
    });

    expect(profileB.messages[0].authorId).toBe(profileB.id);

    const updatedProfileA = await prisma.profile.findFirst({
      where: { id: profileA.id }, 
      include: {
        messages: true,
      },
    });

    expect(updatedProfileA?.messages.length).toBe(0);
  });

  it('retrivie only userName and fullName of profile', async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA 
    } = getNewProfile();
    const profileA = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA 
      },
    });

    let freshProfile = await prisma.profile.findFirstOrThrow({
      select: {
        userName: true,
        fullName: true,
        messages: true,
      },
      where: { id: profileA.id },
    });
    expect(freshProfile.userName).toBe(profileA.userName);
  });

  it('retrieve multiple profiles', async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA 
    } = getNewProfile();
    const profileA = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA 
      },
    });

    const {
      userName: userNameB,
      fullName: fullNameB,
      description: descriptionB,
      region: regionB,
      mainUrl: mainUrlB,
      avatar: avatarB 
    } = getNewProfile();
    let profileB = await prisma.profile.create({
      data: {
        userName: userNameB,
        fullName: fullNameB,
        description: descriptionB,
        region: regionB,
        mainUrl: mainUrlB,
        avatar: avatarB
      },
      include: {
        messages: true,
      }
    });

    let message = await prisma.message.create({
      data: {
        body: '123',
        authorId: profileA.id,
      },
    });

    const profiles = await prisma.profile.findMany({
      where: {
        messages: {
          some: {
            id: {
              in: [BigInt(2432424), BigInt(234242), message.id],
            },
          },
        },
      },
    });
    expect(profiles.length).toBe(1);
    expect(profiles[0].id).toBe(profileA.id);
  });

  it('delete specific profile', async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA 
    } = getNewProfile();
    const profileA = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA 
      },
    });

    const {
      userName: userNameB,
      fullName: fullNameB,
      description: descriptionB,
      region: regionB,
      mainUrl: mainUrlB,
      avatar: avatarB 
    } = getNewProfile();
    let profileB = await prisma.profile.create({
      data: {
        userName: userNameB,
        fullName: fullNameB,
        description: descriptionB,
        region: regionB,
        mainUrl: mainUrlB,
        avatar: avatarB
      },
      include: {
        messages: true,
      }
    });

    await prisma.profile.delete({
      where: {
        id: profileA.id,
      },
    });
    const profiles = await prisma.profile.findMany({
      where: {
        id: {
          in: [profileA.id, profileB.id],
        },
      },
    });
    expect(profiles.length).toBe(1);
    expect(profiles[0].id).toBe(profileB.id);
  });
});
