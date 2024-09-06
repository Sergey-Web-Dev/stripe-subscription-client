// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method === 'POST') {
//     const { paymentMethodId, email } = req.body;

//     try {
//       const response = await fetch(
//         `http://localhost:3000/subscription/create`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ paymentMethodId, email }),
//         },
//       );

//       if (response.ok) {
//         const subscription = await response.json();
//         res.status(200).json(subscription);
//       } else {
//         res.status(response.status).json({ message: 'Subscription failed' });
//       }
//     } catch (error: any) {
//       res
//         .status(500)
//         .json({ message: 'Internal server error', error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { email, priceId, userId } = await req.json();

    // Convert userId to a number
    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
      return NextResponse.json(
        { error: "userId must be a number" },
        { status: 400 }
      );
    }

    // Make your API calls with numericUserId
    const customerResponse = await fetch(
      `${BACKEND_URL}/stripe/create-customer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const user = await customerResponse.json();

    const subscriptionResponse = await fetch(
      `${BACKEND_URL}/stripe/create-subscription/${numericUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      }
    );

    const { clientSecret } = await subscriptionResponse.json();

    return NextResponse.json({ clientSecret }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
