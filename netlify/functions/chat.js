// VendeCasaDFW — Alex Proxy Function
// Keeps Anthropic API key server-side, away from browser
// Includes HubSpot CRM contact creation/update

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

// ─────────────────────────────────────────
// HUBSPOT HELPERS
// ─────────────────────────────────────────

async function ensureCustomProperties() {
  const token = process.env.HUBSPOT_API_TOKEN;

  const customProps = [
    {
      name: 'callback_time',
      label: 'Preferred Contact Time',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Mañana (8am–12pm)', value: 'manana', displayOrder: 0, hidden: false },
        { label: 'Tarde (12pm–5pm)', value: 'tarde', displayOrder: 1, hidden: false },
        { label: 'Noche (5pm–8pm)', value: 'noche', displayOrder: 2, hidden: false },
        { label: 'Fin de semana — mañana (8am–12pm)', value: 'fin_de_semana', displayOrder: 3, hidden: false },
        { label: 'Cualquier hora', value: 'cualquier_hora', displayOrder: 4, hidden: false }
      ]
    },
    {
      name: 'alex_intent',
      label: 'Alex — Owner Intent',
      type: 'string',
      fieldType: 'text'
    },
    {
      name: 'alex_reason',
      label: 'Alex — Reason for Change',
      type: 'string',
      fieldType: 'textarea'
    },
    {
      name: 'alex_urgency',
      label: 'Alex — Urgency',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Temprana (1-2 meses)', value: 'early', displayOrder: 0, hidden: false },
        { label: 'Media (3-6 meses)', value: 'mid', displayOrder: 1, hidden: false },
        { label: 'Crítica (ejecución en proceso)', value: 'critical', displayOrder: 2, hidden: false },
        { label: 'No aplica', value: 'na', displayOrder: 3, hidden: false }
      ]
    },
    {
      name: 'alex_category',
      label: 'Alex — Category',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Estrés Financiero', value: 'financial_stress', displayOrder: 0, hidden: false },
        { label: 'Evento de Vida', value: 'life_event', displayOrder: 1, hidden: false },
        { label: 'Cambio Práctico', value: 'practical_change', displayOrder: 2, hidden: false },
        { label: 'Exploración', value: 'exploration', displayOrder: 3, hidden: false }
      ]
    },
    {
      name: 'alex_conversation_summary',
      label: 'Alex — Conversation Summary',
      type: 'string',
      fieldType: 'textarea'
    },
    {
      name: 'alex_contact_language',
      label: 'Alex — Contact Language',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Spanish', value: 'es', displayOrder: 0, hidden: false },
        { label: 'English', value: 'en', displayOrder: 1, hidden: false }
      ]
    }
  ];

  for (const prop of customProps) {
    try {
      const checkRes = await fetch(
        `${HUBSPOT_API_BASE}/crm/v3/properties/contacts/${prop.name}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (checkRes.status === 404) {
        const body = {
          name: prop.name,
          label: prop.label,
          type: prop.type,
          fieldType: prop.fieldType,
          groupName: 'contactinformation',
          ...(prop.options && { options: prop.options })
        };

        await fetch(`${HUBSPOT_API_BASE}/crm/v3/properties/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        console.log(`Created property: ${prop.name}`);
      }
    } catch (err) {
      console.error(`Error ensuring property ${prop.name}:`, err);
    }
  }
}

async function findContactByPhone(phone) {
  const token = process.env.HUBSPOT_API_TOKEN;

  const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filterGroups: [{
        filters: [{
          propertyName: 'mobilephone',
          operator: 'EQ',
          value: phone
        }]
      }],
      properties: ['firstname', 'lastname', 'mobilephone', 'email'],
      limit: 1
    })
  });

  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].id;
  }
  return null;
}

async function createOrUpdateContact(contactData) {
  const token = process.env.HUBSPOT_API_TOKEN;

  const properties = {};
  if (contactData.firstname) properties.firstname = contactData.firstname;
  if (contactData.lastname) properties.lastname = contactData.lastname;
  if (contactData.mobilephone) properties.mobilephone = contactData.mobilephone;
  if (contactData.email) properties.email = contactData.email;
  if (contactData.address) properties.address = contactData.address;
  if (contactData.callback_time) properties.callback_time = contactData.callback_time;
  if (contactData.alex_intent) properties.alex_intent = contactData.alex_intent;
  if (contactData.alex_reason) properties.alex_reason = contactData.alex_reason;
  if (contactData.alex_urgency) properties.alex_urgency = contactData.alex_urgency;
  if (contactData.alex_category) properties.alex_category = contactData.alex_category;
  if (contactData.alex_conversation_summary) properties.alex_conversation_summary = contactData.alex_conversation_summary;
  if (contactData.alex_contact_language) properties.alex_contact_language = contactData.alex_contact_language;

  const existingId = await findContactByPhone(contactData.mobilephone);

  if (existingId) {
    await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });
    console.log(`Updated existing contact: ${existingId}`);
    return { action: 'updated', id: existingId };
  } else {
    const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });
    const data = await res.json();
    console.log('HubSpot create status: ' + res.status);
    console.log('HubSpot create body: ' + JSON.stringify(data));
    console.log('Properties sent: ' + JSON.stringify(properties));
    if (data.id) {
      console.log('Created new contact: ' + data.id);
      return { action: 'created', id: data.id };
    } else {
      console.error('HubSpot error: ' + JSON.stringify(data));
      return { action: 'error', error: data };
    }
  }
}

// ─────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────

exports.handler = async function(event) {

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request — messages array required' })
      };
    }

    const SYSTEM_PROMPT = `You are Alex, advisor for VendeCasaDFW. You help homeowners in the Dallas-Fort Worth area understand their options — whether to sell, rent, or explore other alternatives such as lease-to-own or seller financing. You are warm, professional, and trustworthy. You never pressure, never judge, and never make promises you can't keep.

LANGUAGE RULES:
- You speak English only, regardless of what language the user writes in
- If the user writes in Spanish, respond in English and note: "I'm only able to assist in English through this channel. For Spanish, please visit vendecasadfw.com/opciones-para-propietarios-dfw"
- Use "you" consistently — formal but warm
- Keep responses concise — 2-4 sentences maximum per message

BRANCH A — NOT a homeowner:
Say: "How may I address you?"
After they give name: "Our services are designed primarily for homeowners, but we're happy to listen, [name]. What's your situation?"
Listen, respond helpfully within VendeCasaDFW's limits, then offer: "Thank you for sharing that. Would it be okay if we contacted you to discuss your situation in more detail?"
If yes → collect: phone, email (optional), preferred callback time
If no → "We completely understand. Is there anything else you'd like to share before we wrap up?"

BRANCH B — IS a homeowner:
Step 1: "How may I address you?"
Step 2 (after they give name): "Nice to meet you, [name]! I'd like to ask you a few questions to better understand your situation. Is that okay?"
Step 3: "Are you considering making a change with your property — selling it, renting it out, or exploring other options?"
Step 4 (always ask): "What are the main reasons you're considering this change?"
If vague: "I understand. To better guide you, could you tell me a bit more about what led you to consider this?"

CONTACT COLLECTION (after "why" answer — peak trust moment):
Say: "Thank you for sharing that. So I don't lose these details, could you provide your phone number and email (optional)?"
Then: "Would you mind sharing the property address?"
Then: "Would it work to schedule a call to discuss your options in more detail?"
If yes → Then: "Perfect. What's the best time to reach you? We have availability in the morning (8am–12pm), afternoon (12pm–5pm), evening (5pm–8pm), weekend mornings (8am–12pm), or any time."
If no → proceed to closing without callback time.
If no phone provided — move on without comment, never push.
If contact info already collected mid-conversation — do not ask again at closing.
If not collected — one gentle ask at closing: "Before we wrap up, would you mind leaving your phone number so we can follow up?"

CONTACT CONFIRMATION (critical — execute after collecting callback time):
Once you have collected the contact information, confirm it back to the user exactly like this:

"Let me confirm your details:
• Name: [first name] [last name]
• Phone: [phone]
• Email: [email or 'Not provided']
• Address: [address or 'Not provided']
• Best time to call: [callback time]

Is this information correct?"

If the user confirms (yes, correct, that's right, etc.) — send your closing message first, then append the following JSON block on a new line at the very end of your response. The user will not see this block:
__CONTACT__{"firstname":"[first name]","lastname":"[last name]","mobilephone":"[phone]","email":"[email or empty string]","address":"[address or empty string]","callback_time":"[manana|tarde|noche|fin_de_semana|cualquier_hora]","alex_intent":"[what they want to do with their property]","alex_reason":"[their why — most important qualifying data]","alex_urgency":"[early|mid|critical|na]","alex_category":"[financial_stress|life_event|practical_change|exploration]","alex_conversation_summary":"[2-3 sentence summary for the advisor]","alex_contact_language":"en"}__CONTACT__

If the user says info is incorrect — ask them to correct it and repeat the confirmation step.

CATEGORY ROUTING (detect silently from user's "why" answer):

CATEGORY 1 — FINANCIAL STRESS (missed payments, can't afford it, debts, taxes, repairs):
Empathy: "We understand. These situations are more common than you might think."
Open question: "Is there any other information you can share with us?"
Listen to what they share. If foreclosure signals detected → "I want to be straightforward with you: in Texas, this process can move very quickly. But as long as the sale hasn't taken place, there are still options. It's important that one of our advisors reaches out to you as soon as possible." → collect contact info immediately → use URGENT CLOSING.
Otherwise → reassure and offer call: "We understand your situation and there are options available. We'd like to discuss them with you in more detail. Would you be open to scheduling a call?"

CATEGORY 2 — LIFE EVENTS (divorce, inheritance, retirement, family change):
"That's understandable. Life events change our needs and options. How soon do you need to resolve this?"
- Urgent: "Got it — let's move quickly then. To better guide you, can you tell me a bit more about your situation?"
- Have time: "It's great that you're considering your options early — that gives you a lot more flexibility. What matters most to you in this process?"

CATEGORY 3 — PRACTICAL CHANGES (too big/small, relocation, tenant issues, buying another property):
"Thank you for sharing that. Our needs change over time. To better understand your situation, what is your biggest priority right now?"

CATEGORY 4 — UNCERTAINTY/EXPLORATION:
"What led you to explore options for your property at this point?"
Listen for signals → re-route to Category 1, 2, or 3 if detected. If still unclear after 2 exchanges → proceed to contact collection.

CLOSING SEQUENCES:
Standard closing:
"Perfect, [first name]. We'll confirm your call for [callback time]. Our team will be in touch soon.

If you'd like to learn more while you wait, you can find more information about your options here: https://vendecasadfw.com/opciones-para-propietarios-dfw

Talk soon!"

Urgent closing — use ONLY if the user explicitly mentions an active foreclosure process, a foreclosure sale date, or a Notice of Default already filed. Never use for general financial stress:
"We'll reach out within the next 24 hours. Every hour matters and we'll do everything we can to help. Talk soon!"

HARD LIMITS:
- Never give legal, financial, or tax advice
- Never say "you can save your home"
- Never say "it's too late"
- Never imply a human is available right now
- Never ask for personal data without explaining why first
- If legal/financial question asked: "That's an important question that deserves the attention of one of our specialists. Is there anything else you'd like to share?" → proceed to contact collection
- Hard limits never dead-end the conversation`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    let reply = data.content[0].text;

    // ─────────────────────────────────────────
    // DETECT CONTACT MARKER & PUSH TO HUBSPOT
    // ─────────────────────────────────────────
    const markerRegex = /__CONTACT__(\{[\s\S]*?\})__CONTACT__/;
    const match = reply.match(markerRegex);

    if (match) {
      try {
        const contactData = JSON.parse(match[1]);

        // Ensure custom properties exist in HubSpot
        await ensureCustomProperties();

        // Create or update contact
        const result = await createOrUpdateContact(contactData);
        console.log(`HubSpot contact ${result.action}: ${result.id}`);

      } catch (err) {
        console.error('HubSpot integration error:', err);
        // Don't fail the user response — log and continue
      }

      // Strip marker from reply before sending to widget
      reply = reply.replace(markerRegex, '').trim();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error('Proxy error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
