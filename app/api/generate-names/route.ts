import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";
import { createClient } from '@/lib/supabase/server';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

// locale 语言 映射表
const localeMap = {
  en: 'English',
  zh: 'Chinese',
}

export async function POST(request: NextRequest) {

  const supabase = await createClient();
  const locale = request.headers.get('Accept-Language') || 'en'
  const { gender, genre, nameStyle, traits, additionalInfo, count, defaultNames } = await request.json();
  const language = localeMap[locale as keyof typeof localeMap] || 'English';

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `你是一个专业的人物名字生成器。根据提供的人物信息,生成${count}个合适的中文名字。只返回json数据。使用${language}语言生成。
          `,
        },
        {
          role: "user",
          content: `性别: ${gender}\n背景: ${genre}\n姓氏类型: ${nameStyle}\n性格特点: ${traits.join(", ")}\n其他信息: ${additionalInfo}
          json格式返回，格式包含一个 characters 的字段，其值为一个数组，数组中包含多个角色对象。每个角色对象包含以下字段：
          name,
          description,
          review
          ## example:
          ${defaultNames}
          \n\n
          使用${language}语言返回。
          `

        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content in response");
    }
    const res = completion.choices[0].message.content;
    const parsedCharacters = JSON.parse(res);

    // 保存生成的角色到 Supabase
    const charactersToInsert = parsedCharacters.characters.map((character: any) => ({
      name: character.name,
      description: character.description,
      review: character.review,
      gender,
      background: genre,
      surname_type: nameStyle,
      traits: traits.join(", "),
      additional_info: additionalInfo
    }));
    console.log(charactersToInsert);

    const { error } = await supabase
      .from('characters')
      .insert(charactersToInsert);

    if (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }

    return NextResponse.json(parsedCharacters);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate names" },
      { status: 500 }
    );
  }
}
